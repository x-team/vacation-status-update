import * as apiHandler from '../handlers/api'
import * as storeHandler from '../handlers/store'
import * as botHandler from '../handlers/bot'

const userStartVacation = async function(user) {
  let vacationDetails = await storeHandler.getVacationDetails(user.userId)
  if (!vacationDetails[0].vacationStarted) {
    let token = await storeHandler.getTeamApiToken(vacationDetails[0].team)
    await apiHandler.changeUserProfile(token, user.userId, vacationDetails[0].status, ':no_entry:')
    storeHandler.setVacationDetailsStarted(user.userId, vacationDetails[0])
    botHandler.informUserAboutVacationStart(vacationDetails[0].team, user.userId)
    botHandler.informChannelAboutVacationStart(token, vacationDetails[0].team, vacationDetails[0].channel.id, user.userId)
  }
}

const userEndVacation = async function(user) {
  let vacationDetails = await storeHandler.getVacationDetails(user.userId)
  if (vacationDetails[0].vacationStarted && !vacationDetails[0].vacationEnded) {
    let token = await storeHandler.getTeamApiToken(vacationDetails[0].team)
    await apiHandler.changeUserProfile(token, user.userId, '', '')
    storeHandler.setVacationDetailsEnded(user.userId, vacationDetails[0])
    botHandler.informUserAboutVacationEnd(vacationDetails[0].team, user.userId)
    botHandler.informChannelAboutVacationEnd(token, vacationDetails[0].team, vacationDetails[0].channel.id, user.userId)
  }
}

export {
  userStartVacation,
  userEndVacation
}
