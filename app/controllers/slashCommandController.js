import express from 'express'
import * as botHandler from '../handlers/bot'

const router = new express.Router()
const START_VACATION = 'start-vacation'

router.post('/slash', async function (req, res) {
  const action = req.body.text
  const command = action.match(/^test\:(.*)/i)
  switch (command[1]) {
    case START_VACATION:
      botHandler.setupVacationStatus()
      res.send('Testing')
      break
    default:
      res.send('Please provide arguments')
  }
})

export default router
