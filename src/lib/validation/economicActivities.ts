export function checkEconomicActivitiesSum(activities: { percentage: number }[]): boolean {
  if (activities.length === 0) return true
  const sum = activities.reduce((acc, a) => acc + a.percentage, 0)
  return Math.abs(sum - 100) <= 2
}
