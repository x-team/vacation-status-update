const getTodayDateObject = () => {
  const currentTime = new Date()
  const month = currentTime.getMonth() + 1
  const day = currentTime.getDate()
  const year = currentTime.getFullYear()

  return { year: year, month: month, day: day }
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

const getStartDateFromAnswer = (answer) => {
  // for now
  return getTodayDateObject()
}

export {
  getStartDateFromAnswer,
  getTodayDateObject,
  validate,
  guessDate
}
