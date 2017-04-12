import express from 'express'
import * as apiHandler from '../handlers/api'

const router = new express.Router()
const START_VACATION = 'start-vacation'

router.post('/slash', async function (req, res) {
  const action = req.body.text
  const userId = req.body.user_id
  const command = action.match(/^test\:(.*)/i)
  switch (command[1]) {
    case START_VACATION:
      apiHandler.changeUserProfile(userId)
      res.send('Testing')
      break
    default:
      res.send('Please provide arguments')
  }
})

export default router
