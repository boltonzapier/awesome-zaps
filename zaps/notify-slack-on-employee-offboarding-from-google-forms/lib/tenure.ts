const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Tenure in years to one decimal place. It is truncated, not rounded, so a 3.96-year tenure
// reads as 3.9 and never overstates how long someone stayed.
export function tenureInYears(hireDate: string, lastDay: string): number {
  const days = (Date.parse(lastDay) - Date.parse(hireDate)) / MS_PER_DAY;
  return Math.floor((days / 365) * 10) / 10;
}
