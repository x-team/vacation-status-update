import * as apiHandler from '../handlers/api'
import * as storeHandler from '../handlers/store'

const userStartVacation = async function(user) {
  let vacationDetails = await storeHandler.getVacationDetails(user.userId)
  if (!vacationDetails[0].vacationStarted) {
    await apiHandler.changeUserProfile(user.userId, vacationDetails[0].status)
    storeHandler.setVacationDetailsStarted(user.userId, vacationDetails[0])
    console.log('starting vacation for:', user.userId)
  } else {
    console.log('Nothing to do, already started once')
  }
}

const userEndVacation = async function(user) {
  let vacationDetails = await storeHandler.getVacationDetails(user.userId)
  if (vacationDetails[0].vacationStarted && !vacationDetails[0].vacationEnded) {
    await apiHandler.changeUserProfile(user.userId, vacationDetails[0].lastName)
    storeHandler.setVacationDetailsEnded(user.userId, vacationDetails[0])
    console.log('ending vacation for:', user.userId)
  } else {
    console.log('Nothing to do, already ended or not started')
  }
}

export {
  userStartVacation,
  userEndVacation
}
