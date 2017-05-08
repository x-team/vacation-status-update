const getTodayDateObject = () => {
  const currentTime = new Date()
  const month = currentTime.getMonth() + 1
  const day = currentTime.getDate()
  const year = currentTime.getFullYear()
  const date = new Date(year, month -1, day)
  return { year: year, month: month, day: day, fancy:date.toDateString()}
}

const validate = (dateFromAnswer) => {
  return /^\d\d\/\d\d\/\d\d\d\d/.test(dateFromAnswer)
}

const guessDate = (dateFromAnswerValidated) => {
  const disectedDate = dateFromAnswerValidated.match(/^(\d\d)\/(\d\d)\/(\d\d\d\d)/i)
  const day = parseInt(disectedDate[1])
  const month = parseInt(disectedDate[2])
  const year = parseInt(disectedDate[3])
  const date = new Date(year, month -1, day)
  return { day: day, month: month, year:year, fancy:date.toDateString()}
}

export {
  getTodayDateObject,
  validate,
  guessDate
}
