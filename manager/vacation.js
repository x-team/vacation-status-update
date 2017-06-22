import * as apiHandler from '../handlers/api'
import * as storeHandler from '../handlers/store'
import * as botHandler from '../handlers/bot'
import * as messageUtil from '../util/message'

const userStartVacation = async function(user) {
  let vacationDetails = await storeHandler.getVacationDetails(user.userId)
  if (!vacationDetails[0].vacationStarted) {
    let token = await storeHandler.getTeamApiToken(vacationDetails[0].team)
    await apiHandler.changeUserProfile(
      token,
      user.userId,
      vacationDetails[0].status,
      ':no_entry:'
    )
    // await apiHandler.setDndStatus(token, user.userId, 60 * 24)
    storeHandler.setVacationDetailsStarted(user.userId, vacationDetails[0])
    storeHandler.addToOnVacationList(user.userId, vacationDetails[0])
    storeHandler.cleanupStartDate(user.userId)
    botHandler.informUserAboutVacationStart(vacationDetails[0].team, user.userId)

    if (vacationDetails[0].channel) {
      let token = await storeHandler.getBotToken(vacationDetails[0].team)
      apiHandler.informChannelAboutVacationStart(
        token,
        vacationDetails[0].channel.id,
        user.userId
      )
    }
  }
}

const userEndVacation = async function(user) {
  let vacationDetails = await storeHandler.getVacationDetails(user.userId)
  if (vacationDetails[0].vacationStarted && !vacationDetails[0].vacationEnded) {
    let token = await storeHandler.getTeamApiToken(vacationDetails[0].team)
    await apiHandler.changeUserProfile(token, user.userId, '', '')
    // await apiHandler.setDndStatus(token, user.userId, 0)
    storeHandler.setVacationDetailsEnded(user.userId, vacationDetails[0])
    storeHandler.removeFromOnVacationsList(user.userId, vacationDetails[0])
    storeHandler.cleanupEndDate(user.userId)
    botHandler.informUserAboutVacationEnd(vacationDetails[0].team, user.userId)

    if (vacationDetails[0].channel) {
      let token = await storeHandler.getBotToken(vacationDetails[0].team)
      apiHandler.informChannelAboutVacationEnd(
        token,
        vacationDetails[0].channel.id,
        user.userId
      )
    }
  }
}

const handleUserMention = async function(message) {
  const mentionedUsers = messageUtil.extractMentionedUsers(message)
  const usersOnVacation = await storeHandler.filterUsersOnVacation(mentionedUsers, message.team)
  let token = await storeHandler.getBotToken(message.team)
  for (let key in usersOnVacation) {
    apiHandler.informChannelMentionedUserIsAway(token, message.channel, usersOnVacation[key])
  }
}

// const bumpDndStatusForUsersOnVacation = async function(teamId, userId) {
//   let token = await storeHandler.getTeamApiToken(teamId)
//   apiHandler.setDndStatus(token, userId, 60 * 24)
// }

export {
  userStartVacation,
  userEndVacation,
  handleUserMention,
}
