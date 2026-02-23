// Seasonal utility functions for restaurant badges and filtering

/**
 * Format an array of month numbers into a readable range string
 * Example: [6, 7, 8, 9, 10] => "June-October"
 */
export function formatSeasonalMonths(months: bigint[]): string {
  if (!months || months.length === 0) return '';

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const sortedMonths = [...months].map(m => Number(m)).sort((a, b) => a - b);
  
  if (sortedMonths.length === 1) {
    return monthNames[sortedMonths[0] - 1];
  }

  // Check if months are consecutive
  const isConsecutive = sortedMonths.every((month, index) => {
    if (index === 0) return true;
    return month === sortedMonths[index - 1] + 1;
  });

  if (isConsecutive) {
    const startMonth = monthNames[sortedMonths[0] - 1];
    const endMonth = monthNames[sortedMonths[sortedMonths.length - 1] - 1];
    return `${startMonth}-${endMonth}`;
  }

  // Non-consecutive months, list them
  return sortedMonths.map(m => monthNames[m - 1]).join(', ');
}

/**
 * Check if the current date falls within the seasonal months
 */
export function isCurrentlyInSeason(seasonalMonths: bigint[]): boolean {
  if (!seasonalMonths || seasonalMonths.length === 0) return false;

  const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11
  return seasonalMonths.some(month => Number(month) === currentMonth);
}

/**
 * Get appropriate badge styling based on whether restaurant is currently in season
 */
export function getSeasonalBadgeStyle(isInSeason: boolean): string {
  if (isInSeason) {
    return 'bg-accent text-accent-foreground border-2 border-accent-foreground/30 shadow-md font-semibold';
  }
  return 'bg-muted text-muted-foreground border border-muted-foreground/30';
}
