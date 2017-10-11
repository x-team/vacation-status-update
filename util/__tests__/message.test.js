const message = require('../message')

test('it should return an empty array if no users in a message', () => {
  const text = 'Hello world'
  const users = message.extractMentionedUsers({ text })
  expect(users).toEqual([])
})

test('it should extract users from message', () => {
  const text = 'Hello <@world>'
  const users = message.extractMentionedUsers({ text })
  expect(users).toEqual(['world'])
})
