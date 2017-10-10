import cron from 'node-cron'
import * as storeHandler from '../handlers/store'
import * as vacationManager from '../manager/vacation'
const START_VACATION_CRON_INTERVAL = '*/30 * * * * *'
const END_VACATION_CRON_INTERVAL = '* * * * *'

const startVacationStartCheckJob = () => {
    cron.schedule(START_VACATION_CRON_INTERVAL, async function() {
        let users = await storeHandler.checkVacationStartToday()
        users.forEach((user) => {
            vacationManager.userStartVacation(user)
        })
    })
}

const startVacationEndCheckJob = () => {
    cron.schedule(END_VACATION_CRON_INTERVAL, async function() {
        let users = await storeHandler.checkVacationEndToday()
        users.forEach((user) => {
            vacationManager.userEndVacation(user)
        })
    })
}

export {
    startVacationStartCheckJob,
    startVacationEndCheckJob,
}
