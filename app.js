import bodyParser from 'body-parser'
import express from 'express'
import router from './controllers'
import * as botHandler from './handlers/bot'
import * as storeHandler from './handlers/store'
import * as cronUtil from './util/cron'
import * as vacationManager from './manager/vacation'

const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', router)
app.listen(port)

setupTeams()

cronUtil.startVacationStartCheckJob()
cronUtil.startVacationEndCheckJob()

async function setupTeams() {
  await storeHandler.init()
  await storeHandler.setupDevTeam()
  const tokens = await storeHandler.getAllTokens()
  botHandler.resumeAllConnections(tokens)
  botHandler.listener.hears(['vacation', 'holiday', 'ooo', 'time off'], ['ambient'], (bot, message) => {
    botHandler.startVacationRequestConversation(bot, message.user)
  })
  botHandler.listener.hears('@', ['ambient'], (bot, message) => {
    vacationManager.handleUserMention(message)
  })
}
