import cron from 'node-cron'
import * as storeHandler from '../handlers/store'
import * as vacationManager from '../manager/vacation'
const START_VACATION_CRON_INTERVAL = '*/30 * * * * *'
const END_VACATION_CRON_INTERVAL = '* * * * *'

const startVacationStartCheckJob = () => {
  cron.schedule(START_VACATION_CRON_INTERVAL, async function() {
    let users = await storeHandler.checkVacationStartToday()
    users.forEach((user, index) => {
      vacationManager.userStartVacation(user)
    })
  })
}

const startVacationEndCheckJob = () => {
  cron.schedule(END_VACATION_CRON_INTERVAL, async function() {
    let users = await storeHandler.checkVacationEndToday()
    users.forEach((user, index) => {
      vacationManager.userEndVacation(user)
    })
  })
}

const bumpDndStatusForUsersOnVacation = async function() {
  let teamsWithUsersOnVacation = await storeHandler.getAllTeamsWithUsersOnVacation()
  console.log('Teams with users on vacation', teamsWithUsersOnVacation)
  // if they are still on vacation, bump by 24h
  // if they are not on vacation do nothing
}

export {
  startVacationStartCheckJob,
  startVacationEndCheckJob,
  bumpDndStatusForUsersOnVacation,
}
