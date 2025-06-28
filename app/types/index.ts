export interface CalculatorInputs {
  currentExpense: number;
  currentAge: number;
  inflationRate: number;
  investmentReturn: number;
  currentAssets: number;
  retireAge: number;
  partialIncome: number;
  partialIncomeUntilAge: number;
  annualSavings: number;
  dieAge: number;
  inflationAdjustPartialIncome: boolean;
  inflationAdjustSavings: boolean;
  strategy?: "FIRE" | "DIE_WITH_ZERO" | "CURRENT_PLAN";
  // Input mode toggles
  expenseInputMode?: "monthly" | "annual";
  partialIncomeInputMode?: "monthly" | "annual";
  savingsInputMode?: "monthly" | "annual";
}

export interface YearData {
  year: number;
  age: number;
  assets: number;
  expenses: number;
  income: number;
  netWorth: number;
}
