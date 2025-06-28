export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const parseNumber = (value: string) => {
  // Remove commas and leading zeros
  const cleaned = value.replace(/,/g, "").replace(/^0+/, "") || "0";
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
};

export const formatAge = (value: number) => {
  return value.toString();
};

export const parseAge = (value: string) => {
  // Remove leading zeros and ensure it's a valid number
  const cleaned = value.replace(/^0+/, "") || "0";
  const num = Number(cleaned);
  if (isNaN(num)) return 0;
  // Cap age at maximum of 200
  return Math.min(num, 200);
};

export const parsePercentage = (value: string) => {
  // Remove leading zeros and ensure it's a valid percentage
  const cleaned = value.replace(/^0+/, "") || "0";
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
};

export const formatCompactCurrency = (value: number) => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1000000000) {
    return `${sign}$${(absValue / 1000000000).toFixed(1)}B`;
  } else if (absValue >= 1000000) {
    return `${sign}$${(absValue / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    return `${sign}$${(absValue / 1000).toFixed(0)}K`;
  } else {
    return `${sign}$${absValue.toFixed(0)}`;
  }
};
