import express from 'express'
import * as storeHandler from '../handlers/store'

const router = new express.Router()

router.post('/im', async function (req, res) {
  if (req.body.payload) {
    const payload = JSON.parse(req.body.payload)
    if (payload.actions[0].type === 'select') {
      const channelId = payload.actions[0].selected_options[0].value
      const userId = payload.user.id
      storeHandler.storeChannelNotificationInfo(userId, channelId)
    }
  }
  res.send('Thanks!')
})

export default router
