const date = require('../date')

test('it should validate date format', () => {
  expect(date.validate('01/01/2001')).toBe(true)
  expect(date.validate('01-01-2001')).toBe(false)
  expect(date.validate('2001-01-01')).toBe(false)
})

test('it should parse valid date string to date object', () => {
  const dateObject = {day: 1, fancy: 'Mon Jan 01 2001', month: 1, year: 2001}
  expect(date.guessDate('01/01/2001')).toEqual(dateObject)
})
