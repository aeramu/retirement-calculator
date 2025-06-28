import { CalculatorInputs, YearData } from "../types";

// Check if calculation results are within safe numerical limits
export const hasCalculationLimits = (data: YearData[]): boolean => {
  return data.some(
    (point) =>
      point.assets >= Number.MAX_SAFE_INTEGER ||
      point.expenses >= Number.MAX_SAFE_INTEGER ||
      point.income >= Number.MAX_SAFE_INTEGER ||
      !isFinite(point.assets) ||
      !isFinite(point.expenses) ||
      !isFinite(point.income)
  );
};

// Safe compound calculation that handles very large numbers and long time periods
export const safeCompound = (
  principal: number,
  rate: number,
  years: number
): number => {
  if (years === 0) return principal;
  if (rate === 0) return principal;

  // Use logarithmic calculation for very large results to maintain accuracy
  // log(result) = log(principal) + years * log(1 + rate)
  const logResult = Math.log(principal) + years * Math.log(1 + rate);

  // Check if the result would be too large for JavaScript to handle accurately
  const maxSafeLog = Math.log(Number.MAX_SAFE_INTEGER);

  if (logResult > maxSafeLog) {
    // Return Infinity to indicate the number is beyond safe calculation range
    return Infinity;
  }

  const result = Math.exp(logResult);
  return isFinite(result) ? result : Infinity;
};

// Safe annuity factor calculation for future value of annuity
const safeAnnuityFactor = (rate: number, years: number): number => {
  if (rate === 0) return years;
  if (years === 0) return 0;

  // Calculate (1 + rate)^years using our safe compound function
  const compoundedValue = safeCompound(1, rate, years);

  if (!isFinite(compoundedValue)) {
    // For very large periods, the formula approaches 1/rate
    return 1 / rate;
  }

  const factor = (compoundedValue - 1) / rate;
  return isFinite(factor) ? factor : 1 / rate;
};

// Growing annuity factor for inflation-adjusted savings
// Formula: [((1+r)^n - (1+g)^n) / (r-g)] where r = investment return, g = growth rate
const safeGrowingAnnuityFactor = (
  investmentRate: number,
  growthRate: number,
  years: number
): number => {
  if (years === 0) return 0;

  // If rates are equal, the formula simplifies to n * (1+r)^(n-1)
  if (Math.abs(investmentRate - growthRate) < 0.0001) {
    const compoundedValue = safeCompound(1, investmentRate, years - 1);
    return years * compoundedValue;
  }

  const investmentCompounded = safeCompound(1, investmentRate, years);
  const growthCompounded = safeCompound(1, growthRate, years);

  if (!isFinite(investmentCompounded) || !isFinite(growthCompounded)) {
    // For very large periods, approximate
    return 1 / (investmentRate - growthRate);
  }

  const factor =
    (investmentCompounded - growthCompounded) / (investmentRate - growthRate);
  return isFinite(factor) ? factor : 1 / (investmentRate - growthRate);
};

export const calculateRetirement = (inputs: CalculatorInputs): YearData[] => {
  const data: YearData[] = [];
  const maxAge = inputs.dieAge;

  let currentAssets = inputs.currentAssets;

  for (let year = 0; year <= maxAge - inputs.currentAge; year++) {
    const currentYear = new Date().getFullYear() + year;
    const age = inputs.currentAge + year;

    // Calculate inflation-adjusted expenses
    const inflatedExpense = safeCompound(
      inputs.currentExpense,
      inputs.inflationRate / 100,
      year
    );

    // Calculate income (partial income if retired and within range)
    let income = 0;
    if (age >= inputs.retireAge && age <= inputs.partialIncomeUntilAge) {
      if (inputs.inflationAdjustPartialIncome) {
        // Inflate partial income from retirement year, not from current age
        const yearsFromRetirement = age - inputs.retireAge;
        income = safeCompound(
          inputs.partialIncome,
          inputs.inflationRate / 100,
          yearsFromRetirement
        );
      } else {
        income = inputs.partialIncome;
      }
    }

    if (age < inputs.retireAge) {
      // Accumulation phase - use savings amount with optional inflation adjustment
      let currentYearSavings = inputs.annualSavings;
      if (inputs.inflationAdjustSavings) {
        currentYearSavings = safeCompound(
          inputs.annualSavings,
          inputs.inflationRate / 100,
          year
        );
      }

      currentAssets =
        currentAssets * (1 + inputs.investmentReturn / 100) +
        currentYearSavings;
    } else {
      // Retirement phase - withdraw net expenses from assets
      const withdrawalAmount = Math.max(0, inflatedExpense - income);

      if (currentAssets > 0) {
        // Apply investment returns only if assets are positive
        currentAssets =
          currentAssets * (1 + inputs.investmentReturn / 100) -
          withdrawalAmount;
      } else {
        // If already negative, just subtract expenses (no investment returns on debt)
        currentAssets = currentAssets - withdrawalAmount;
      }
    }

    // Handle cases where calculations exceed JavaScript's safe number range
    const safeAssets = !isFinite(currentAssets)
      ? Number.MAX_SAFE_INTEGER
      : currentAssets;
    const safeExpenses = !isFinite(inflatedExpense)
      ? Number.MAX_SAFE_INTEGER
      : Math.max(0, inflatedExpense - income);
    const safeIncome = !isFinite(income) ? Number.MAX_SAFE_INTEGER : income;

    data.push({
      year: currentYear,
      age,
      assets: safeAssets,
      expenses: safeExpenses,
      income: safeIncome,
      netWorth: safeAssets,
    });
  }

  return data;
};

export const calculateFireSavings = (inputs: CalculatorInputs): number => {
  // Calculate future value of current expenses at retirement
  const yearsToRetirement = inputs.retireAge - inputs.currentAge;
  const futureExpenses = safeCompound(
    inputs.currentExpense,
    inputs.inflationRate / 100,
    yearsToRetirement
  );

  // For FIRE, we need assets to sustain us indefinitely
  // Since partial income may not last forever (only until partialIncomeUntilAge),
  // we should calculate based on the worst-case scenario: full expenses with no income
  // This ensures true financial independence even after partial income stops

  // Use full expenses for FIRE calculation (conservative approach)
  const netExpensesToCover = futureExpenses;

  // For FIRE (sustainable forever), you can only withdraw the real return
  // Real return = investment return - inflation
  // Required assets = net withdrawal / real return rate
  const realReturnRate = (inputs.investmentReturn - inputs.inflationRate) / 100;

  // Handle edge case where real return is zero or negative
  let requiredAssets: number;
  if (realReturnRate <= 0) {
    // If real return is zero or negative, infinite assets would be needed
    requiredAssets = Infinity;
  } else {
    requiredAssets = netExpensesToCover / realReturnRate;
  }

  // If required assets are infinite or exceed safe calculation range, return max safe value
  if (!isFinite(requiredAssets)) {
    return Number.MAX_SAFE_INTEGER;
  }

  // Calculate future value of current assets
  const futureCurrentAssets = safeCompound(
    inputs.currentAssets,
    inputs.investmentReturn / 100,
    yearsToRetirement
  );

  // Handle infinite future assets
  if (!isFinite(futureCurrentAssets)) {
    // If current assets grow to infinity, no additional savings needed
    return 0;
  }

  // Calculate required additional assets needed
  const additionalAssetsNeeded = Math.max(
    0,
    requiredAssets - futureCurrentAssets
  );

  // Handle infinite additional assets needed
  if (!isFinite(additionalAssetsNeeded)) {
    return Number.MAX_SAFE_INTEGER;
  }

  // Calculate required annual savings using future value of annuity formula
  if (yearsToRetirement <= 0) return 0;

  if (inputs.inflationAdjustSavings) {
    // For inflation-adjusted savings, use growing annuity formula
    const investmentRate = inputs.investmentReturn / 100;
    const inflationRate = inputs.inflationRate / 100;

    if (Math.abs(investmentRate - inflationRate) < 0.001) {
      return additionalAssetsNeeded / yearsToRetirement;
    }

    // Future value of growing annuity formula: FV = PMT × [((1+r)^n - (1+g)^n) / (r-g)]
    const annuityFactor = safeGrowingAnnuityFactor(
      investmentRate,
      inflationRate,
      yearsToRetirement
    );
    return additionalAssetsNeeded / annuityFactor;
  } else {
    // For nominal savings, use annual annuity formula
    const annualRate = inputs.investmentReturn / 100;

    if (annualRate === 0) {
      // If no investment return, simply divide by years
      return additionalAssetsNeeded / yearsToRetirement;
    }

    // Future value of annuity formula: FV = PMT * [((1 + r)^n - 1) / r]
    // Solving for PMT: PMT = FV / [((1 + r)^n - 1) / r]
    const annuityFactor = safeAnnuityFactor(annualRate, yearsToRetirement);

    return additionalAssetsNeeded / annuityFactor;
  }
};

// Helper function to test annual savings and get final assets
const testAnnualSavingsResult = (
  inputs: CalculatorInputs,
  annualSavings: number
): number => {
  // Round to whole dollars to match real-world input precision
  const roundedSavings = Math.round(annualSavings);
  const testInputs = { ...inputs, annualSavings: roundedSavings };
  const testData = calculateRetirement(testInputs);
  return testData[testData.length - 1]?.assets || 0;
};

// Calculate mathematical estimate for Die with Zero savings
const calculateMathematicalDieWithZeroSavings = (
  inputs: CalculatorInputs
): number => {
  const yearsToRetirement = inputs.retireAge - inputs.currentAge;
  const yearsInRetirement = inputs.dieAge - inputs.retireAge + 1;
  const investmentRate = inputs.investmentReturn / 100;
  const inflationRate = inputs.inflationRate / 100;

  // Calculate all the cash flows for each year of retirement
  const cashFlows: Array<{
    expense: number;
    income: number;
    netWithdrawal: number;
  }> = [];

  for (let year = 0; year < yearsInRetirement; year++) {
    const currentAge = inputs.retireAge + year;
    const yearsFromToday = yearsToRetirement + year;

    // Calculate inflated expense for this year (same as simulation)
    const yearExpense = safeCompound(
      inputs.currentExpense,
      inflationRate,
      yearsFromToday
    );

    // Calculate income for this year (same as simulation)
    let yearIncome = 0;
    if (currentAge <= inputs.partialIncomeUntilAge) {
      if (inputs.inflationAdjustPartialIncome) {
        yearIncome = safeCompound(inputs.partialIncome, inflationRate, year);
      } else {
        yearIncome = inputs.partialIncome;
      }
    }

    const netWithdrawal = Math.max(0, yearExpense - yearIncome);
    cashFlows.push({ expense: yearExpense, income: yearIncome, netWithdrawal });
  }

  // Work backwards: start with $0 at end, work backwards to find required starting assets
  // The simulation logic is: assets_after = (assets_before * (1 + rate)) - withdrawal
  // So working backwards: assets_before = (assets_after + withdrawal) / (1 + rate)

  let requiredAssets = 0; // We want $0 at the very end

  // Work backwards through each year
  for (let year = yearsInRetirement - 1; year >= 0; year--) {
    const netWithdrawal = cashFlows[year].netWithdrawal;
    requiredAssets = (requiredAssets + netWithdrawal) / (1 + investmentRate);
  }

  const requiredStartingAssets = requiredAssets;
  const futureCurrentAssets = safeCompound(
    inputs.currentAssets,
    investmentRate,
    yearsToRetirement
  );
  const additionalAssetsNeeded = Math.max(
    0,
    requiredStartingAssets - futureCurrentAssets
  );

  if (additionalAssetsNeeded === 0) return 0;

  // Convert to required annual savings using annuity formulas
  let result: number;

  if (inputs.inflationAdjustSavings) {
    if (Math.abs(investmentRate - inflationRate) < 0.001) {
      result = additionalAssetsNeeded / yearsToRetirement;
    } else {
      const annuityFactor = safeGrowingAnnuityFactor(
        investmentRate,
        inflationRate,
        yearsToRetirement
      );
      result = additionalAssetsNeeded / annuityFactor;
    }
  } else {
    if (investmentRate === 0) {
      result = additionalAssetsNeeded / yearsToRetirement;
    } else {
      const annuityFactor = safeAnnuityFactor(
        investmentRate,
        yearsToRetirement
      );
      result = additionalAssetsNeeded / annuityFactor;
    }
  }

  return Math.max(0, result);
};

// Refine Die with Zero savings using smart refinement
const refineDieWithZeroSavings = (
  inputs: CalculatorInputs,
  mathSavings: number
): number => {
  const tolerance = Math.max(1, inputs.currentExpense / 10000); // 0.01% tolerance

  // Test the mathematical result first
  const mathResult = testAnnualSavingsResult(inputs, mathSavings);

  // If mathematical result is slightly negative, try small dollar increments first
  if (mathResult < 0 && mathResult > -tolerance * 100) {
    // Try adding small dollar increments: $1, $2, $5, $10, $20, $50
    const dollarIncrements = [1, 2, 5, 10, 20, 50];
    for (const increment of dollarIncrements) {
      const testSavings = Math.round(mathSavings) + increment;
      const testResult = testAnnualSavingsResult(inputs, testSavings);

      if (testResult >= 0 && testResult <= tolerance) {
        return testSavings;
      }

      if (testResult >= 0) {
        // Found a positive result, we can now do binary search in a tight range
        return binarySearchInRange(
          inputs,
          Math.round(mathSavings),
          testSavings,
          tolerance
        );
      }
    }
  }

  // If mathematical result is very positive, try small dollar decrements first
  if (mathResult > tolerance * 2) {
    // Try subtracting small dollar decrements: $1, $2, $5, $10, $20, $50
    const dollarDecrements = [1, 2, 5, 10, 20, 50];
    for (const decrement of dollarDecrements) {
      const testSavings = Math.round(mathSavings) - decrement;
      if (testSavings < 0) continue; // Skip if result would be negative

      const testResult = testAnnualSavingsResult(inputs, testSavings);

      if (testResult >= 0 && testResult <= tolerance) {
        return testSavings;
      }

      if (testResult < 0) {
        // Found a negative result, we can now do binary search in a tight range
        return binarySearchInRange(
          inputs,
          testSavings,
          Math.round(mathSavings),
          tolerance
        );
      }
    }
  }

  // Fall back to traditional binary search with adaptive range
  const rangeFactor = mathSavings > 0 ? 0.1 : 0.5; // Tighter range for positive estimates
  let lowSavings = Math.max(0, Math.round(mathSavings * (1 - rangeFactor)));
  let highSavings = Math.round(mathSavings * (1 + rangeFactor));

  // Ensure we have a working upper bound (with safety limit)
  let attempts = 0;
  while (testAnnualSavingsResult(inputs, highSavings) < 0 && attempts < 20) {
    lowSavings = highSavings;
    highSavings = Math.round(highSavings * 1.2); // Slightly larger multiplier for faster convergence
    attempts++;
  }

  // If we couldn't find a working upper bound, use a much larger value
  if (testAnnualSavingsResult(inputs, highSavings) < 0) {
    highSavings = Math.round(mathSavings * 5); // Much larger fallback
  }

  return binarySearchInRange(inputs, lowSavings, highSavings, tolerance);
};

// Helper function to perform binary search in a given range
const binarySearchInRange = (
  inputs: CalculatorInputs,
  lowSavings: number,
  highSavings: number,
  tolerance: number
): number => {
  for (let i = 0; i < 50; i++) {
    const midSavings = Math.round((lowSavings + highSavings) / 2);
    const result = testAnnualSavingsResult(inputs, midSavings);

    if (result >= 0 && result <= tolerance) {
      return midSavings;
    }

    if (result < 0) {
      lowSavings = midSavings;
    } else {
      highSavings = midSavings;
    }

    if (highSavings - lowSavings <= 1) {
      break;
    }
  }

  return Math.round(highSavings);
};

// Calculate required savings for Die with Zero strategy
export const calculateDieWithZeroSavings = (
  inputs: CalculatorInputs
): number => {
  const yearsToRetirement = inputs.retireAge - inputs.currentAge;
  const yearsInRetirement = inputs.dieAge - inputs.retireAge + 1;

  if (yearsToRetirement <= 0 || yearsInRetirement <= 0) {
    return 0;
  }

  const mathSavings = calculateMathematicalDieWithZeroSavings(inputs);
  if (mathSavings === 0) {
    return 0;
  }

  const roundedMathSavings = Math.max(0, Math.round(mathSavings)); // Ensure non-negative
  const refinedSavings = refineDieWithZeroSavings(inputs, roundedMathSavings);
  return refinedSavings;
};
