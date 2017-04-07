import bodyParser from 'body-parser'
import express from 'express'
import * as botHandler from './handler/bot'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

botHandler.listener.hears(['vacation', 'holiday', 'ooo', 'time off'], ['ambient'], (bot, message) => {
  console.log(`User: ${message.user} want to take a vacation`)
  botHandler.startVacationRequestConversation(message.user)
  // start conversation with user
  //    ask if he wants to file in vacation request
  //    yes > what is the start date, then what is the end date
  //    then ask if ok and change status
})

var port = process.env.PORT || 3000
app.listen(port)

app.get('/', async function (req, res) {
  res.send('Hello')
})
