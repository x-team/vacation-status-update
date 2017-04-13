export const getTodayDateObject = () => {
  const currentTime = new Date()
  const month = currentTime.getMonth() + 1
  const day = currentTime.getDate()
  const year = currentTime.getFullYear()

  return {year: year, month: month, day: day}
}
