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
    const vacationRequestPhrases = [
        'vacation',
        'holiday',
        'time off',
        /\booo\b/gim,
        /\bday(s)? off\b/gim,
        /\bout of( the)? office\b/gim,
        /i(am|’m|'m') (off|out) (next|from) (\w+-\w+|\w+)(\sto\s\w+)?/gim,
        /(i|we)(\swill|'ll|’ll) be (out|off) (most of the|next) (day|week|month|year|time|couple of days)/gim,
        /(i|we)(\swill|'ll|’ll) be (out|off) (the day after\s)?tomorrow/gim,
        /(i|we)(\swill|'ll|’ll) be (out|off) in (\w+|\d+) days/gim,
        /(i|we)(\swill|'ll|’ll|\sneed to) take (some|a) time off/gim,
    ]

    const listOffPeoplePhrases = [
        /(who's|who`s|whos|who is) (off|on vacation)/,
    ]

    botHandler.listener.hears(vacationRequestPhrases, ['ambient'], (bot, message) => {
        botHandler.startVacationRequestConversation(bot, message.user)
        botHandler.markMessageWithEmoji(bot, message)
    })

    botHandler.listener.hears('@', ['ambient'], (bot, message) => {
        vacationManager.handleUserMention(message)
    })

    botHandler.listener.hears(listOffPeoplePhrases, ['direct_message', 'direct_mention'], (bot, message) => {
        botHandler.startListOffPeopleConversation(bot, message)
    })
}
