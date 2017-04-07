import bodyParser from 'body-parser'
import express from 'express'
import * as botHandler from './handler/bot'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

botHandler.listener.hears(['vacation', 'holiday', 'ooo', 'time off'], ['ambient'], (bot, message) => {
  console.log('ambient message:', message.text)
})

var port = process.env.PORT || 3000
app.listen(port)

app.get('/', async function (req, res) {
  res.send('Hello')
})
