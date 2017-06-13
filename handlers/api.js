import slack from 'slack-node'
import * as errorUtil from '../util/error'

const changeUserProfile = (token, userId, text, emoji) => {
  return new Promise((resolve, reject) => {
    const profile = `{"status_text":"${text}","status_emoji": "${emoji}"}`
    const apiCallData = { user: userId, profile: profile}
    const slackClient = new slack(token)
    slackClient.api('users.profile.set', apiCallData, (err, response) => {
      if (err) {
        reject(err)
      } else {
        console.log('set presence response', response, apiCallData)
        resolve(true)
      }
    })
  })
}

const getUserData = (token, userId) => {
  return new Promise((resolve, reject) => {
    const slackClient = new slack(token)
    slackClient.api('users.info', {user: userId}, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response.user)
      }
    })
  })
}

const identifyDevBotData = () => {
  return new Promise((resolve, reject) => {
    const slackClient = new slack(process.env.slack_api_token)
    slackClient.api('auth.test', (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

const exchangeCodeForToken = (code) => {
  return new Promise((resolve, reject) => {
    const data = {
      client_id: process.env.slack_app_client_id,
      client_secret: process.env.slack_app_client_secret,
      code,
      redirect_uri: process.env.slack_app_redirect_uri,
    }
    const slackClient = new slack(process.env.slack_api_token)
    slackClient.api('oauth.access', data, (err, response) => {
      try {
        errorUtil.handleAuthResponse(response)
      } catch (e) {
        console.log('Token exchange err', e)
        reject('invalid token')
      } finally {
        console.log('Token exchange ok response', response)
        resolve(response)
      }
    })
  })
}

const informChannelAboutVacationStart = async function(token, channelId, userId) {
  let userData = await getUserData(token, userId)
  const data = {
      text: `@${userData.name} is starting vacation Today.`,
      channel: channelId,
  }
  const slackClient = new slack(token)
  slackClient.api('chat.postMessage', data)
}

const informChannelAboutVacationEnd = async function(token, channelId, userId) {
  let userData = await getUserData(token, userId)
  const data = {
      text: `@${userData.name} is ending vacation Today.`,
      channel: channelId,
  }
  const slackClient = new slack(token)
  slackClient.api('chat.postMessage', data)
}

const informChannelMentionedUserIsAway = async function(token, channelId, userId) {
  let userData = await getUserData(token, userId)
  const data = {
      text: `@${userData.name} is currently on vacation.`,
      channel: channelId,
  }
  const slackClient = new slack(token)
  slackClient.api('chat.postMessage', data)
}

const setDndStatus = (token, userId, minutes) => {
  const data = {
    num_minutes: minutes
  }
  const slackClient = new slack(token)
  slackClient.api('dnd.setSnooze', data, (err, response) => {
    console.log('SET DND', response)
  })
}

export {
  changeUserProfile,
  getUserData,
  exchangeCodeForToken,
  identifyDevBotData,
  informChannelAboutVacationStart,
  informChannelAboutVacationEnd,
  informChannelMentionedUserIsAway,
  setDndStatus
}
