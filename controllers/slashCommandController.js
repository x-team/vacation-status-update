import express from 'express'
import * as apiHandler from '../handlers/api'
import * as storeHandler from '../handlers/store'
import * as dateUtil from '../util/date'

const router = new express.Router()
const START_VACATION = 'start-vacation'

router.post('/slash', async function (req, res) {
  const action = req.body.text
  const userId = req.body.user_id
  let userData = await apiHandler.getUserData(userId)
  const command = action.match(/^test\:(.*)/i)
  switch (command[1]) {
    case START_VACATION:
      const startDate = dateUtil.getTodayDateObject()
      const endDate = dateUtil.getTodayDateObject()
      storeHandler.storeVacationInfo(userId, userData, startDate, endDate)
      res.send('OK')
      break
    default:
      res.send('Please provide arguments')
  }
})

export default router
