import bodyParser from 'body-parser'
import express from 'express'
import router from './controllers'
import * as botHandler from './handlers/bot'
import * as cronUtil from './util/cron'

const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', router)
app.listen(port)

botHandler.listener.hears(['vacation', 'holiday', 'ooo', 'time off'], ['ambient'], (bot, message) => {
  botHandler.startVacationRequestConversation(bot, message.user)
})

cronUtil.startVacationStartCheckJob()
cronUtil.startVacationEndCheckJob()
