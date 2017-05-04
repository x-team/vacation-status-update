import express from 'express'
import * as apiHandler from '../handlers/api'
import * as storeHandler from '../handlers/store'
import * as botHandler from '../handlers/bot'

const router = new express.Router()

router.get('/auth', async function (req, res) {
  let token = await apiHandler
    .exchangeCodeForToken(req.query.code)
    .catch(() => {
     res.send('Error. Invalid/expired code.')
    });

  if (token) {
    storeHandler.storeTeamToken(token)
    botHandler.createNewBotConnection(token.bot.bot_access_token)
    res.send('Thank you for authorizing our application')
  }
})

export default router
