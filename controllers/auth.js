import express from 'express'
import { exchangeCodeForToken } from '../handlers/api'
import { storeTeamToken } from '../handlers/store'
import { createNewBotConnection, sendPostInstallMessage } from '../handlers/bot'

const router = new express.Router()

router.get('/auth', async (req, res) => {
  try {
    const token = await exchangeCodeForToken(req.query.code)
    console.log(token)
    storeTeamToken(token)
    const bot = createNewBotConnection({
      token: token.bot.bot_access_token,
      team: token.team_id
    })
    sendPostInstallMessage(bot, token.user_id)
    res.send('Thank you for authorizing our application')
  } catch (e) {
    res.send('Error. Invalid/expired code.')
  }
})

export default router
