import firebase from 'firebase'
import * as formatterUtil from '../util/formatter'
import * as dateUtil from '../util/date'
import * as apiHandler from './api'

const VACATION_START = 'start'
const VACATION_END = 'end'
const VACATION_DATES_ENDPOINT = 'dates'
const VACATION_USER_DETAILS = 'users'
const VACATION_TOKENS = 'tokens'
const config = {
  apiKey: process.env.firebase_config_apikey,
  authDomain: process.env.firebase_config_authdomain,
  databaseURL: process.env.firebase_config_databaseurl,
  storageBucket: process.env.firebase_config_storagebucket,
  messagingSenderId: process.env.firebase_config_messagingsenderid,
  projectId: process.env.firebase_config_projectid
}

const init = () => {
  firebase.initializeApp(config)
  return firebase.auth().signInAnonymously()
}

const storeVacationStart = (date, userId) => {
  const data = { user: userId, date: date, type: VACATION_START}
  const ref = `${VACATION_DATES_ENDPOINT}/${date.year}/${date.month}/${date.day}/${VACATION_START}/${userId}`
  firebase.database().ref(ref).set(data)
}

const storeVacationEnd = (date, userId) => {
  const data = { user: userId, date: date, type: VACATION_END}
  const ref = `${VACATION_DATES_ENDPOINT}/${date.year}/${date.month}/${date.day}/${VACATION_END}/${userId}`
  firebase.database().ref(ref).set(data)
}

const storeVacationDetails = (userData, startDate, endDate, status) => {
  const data = {user: userData.userId, team: userData.teamId, startDate: startDate, endDate: endDate, status: status}
  const ref = `${VACATION_USER_DETAILS}/${userData.userId}/0`
  firebase.database().ref(ref).set(data)
}

const storeVacationInfo = (userData, startDate, endDate) => {
  const status = formatterUtil.formatStatus(endDate)
  storeVacationStart(startDate, userData.userId)
  storeVacationEnd(endDate, userData.userId)
  storeVacationDetails(userData, startDate, endDate, status)
}

const storeChannelNotificationInfo = (userId, channelId) => {
  const ref = `${VACATION_USER_DETAILS}/${userId}/0/channel`
  firebase.database().ref(ref).set({ id: channelId })
}

const storeTeamToken = (token) => {
  const botData = { botToken: token.bot.bot_access_token, botUserId: token.bot.bot_user_id }
  const data = { teamId: token.team_id, bot: botData, token: token.access_token }
  const ref = `${VACATION_TOKENS}/${token.team_id}`
  firebase.database().ref(ref).set(data)
}

const setupDevTeam = async function() {
  let devBotData = await apiHandler.identifyDevBotData()
  const botData = { bot_access_token: process.env.slack_bot_token, bot_user_id: devBotData.user_id}
  const tokenData = { bot: botData, team_id: devBotData.team_id, access_token: process.env.slack_api_token}
  storeTeamToken(tokenData)
}

const getTeamApiToken = (teamId) => {
  return new Promise((resolve, reject) => {
    const tokens = firebase.database().ref(`${VACATION_TOKENS}/${teamId}`)
      tokens.on('value', (snapshot) => {
        resolve(snapshot.val().token)
    })
  })
}

const getUserTeamId = (userId) => {
  return new Promise((resolve, reject) => {
    const tokens = firebase.database().ref(`${VACATION_USER_DETAILS}/${userId}/0`)
      tokens.on('value', (snapshot) => {
        resolve(snapshot.val().team)
    })
  })
}

const getUserVacationDetails = (userId) => {
  return new Promise((resolve, reject) => {
    const tokens = firebase.database().ref(`${VACATION_USER_DETAILS}/${userId}/0`)
      tokens.on('value', (snapshot) => {
        resolve(snapshot.val())
    })
  })
}

const getAllTokens = () => {
  return new Promise((resolve, reject) => {
    const teamsTokens = firebase.database().ref(VACATION_TOKENS)
      teamsTokens.once('value', (snapshot) => {
        let tokens = []
        const snaps = snapshot.val()
        for (var key in snaps) {
          if (snaps.hasOwnProperty(key)) {
            tokens.push({ token: snaps[key].bot.botToken, team: key })
          }
        }
        resolve(tokens)
    })
  })
}

const checkVacationStartToday = () => {
  return new Promise((resolve, reject) => {
    const dateToday = dateUtil.getTodayDateObject()
    const ref = `${VACATION_DATES_ENDPOINT}/${dateToday.year}/${dateToday.month}/${dateToday.day}/${VACATION_START}`
    const vacationDetails = firebase.database().ref(ref)
      vacationDetails.once('value', (snapshot) => {
        let users = []
        const snaps = snapshot.val()
        for (var key in snaps) {
          if (snaps.hasOwnProperty(key)) {
            users.push({userId: key})
          }
        }
        resolve(users)
    })
  })
}

const checkVacationEndToday = () => {
  return new Promise((resolve, reject) => {
    const dateToday = dateUtil.getTodayDateObject()
    const ref = `${VACATION_DATES_ENDPOINT}/${dateToday.year}/${dateToday.month}/${dateToday.day}/${VACATION_END}`
    const vacationDetails = firebase.database().ref(ref)
      vacationDetails.once('value', (snapshot) => {
        let users = []
        const snaps = snapshot.val()
        for (var key in snaps) {
          if (snaps.hasOwnProperty(key)) {
            users.push({userId: key})
          }
        }
        resolve(users)
    })
  })
}

const getVacationDetails = (userId) => {
  return new Promise((resolve, reject) => {
    const vacationDetails = firebase.database().ref(`${VACATION_USER_DETAILS}/${userId}`)
      vacationDetails.on('value', (snapshot) => {
        resolve(snapshot.val())
    })
  })
}

const setVacationDetailsStarted = (userId, vacationDetails) => {
  vacationDetails.vacationStarted = true
  vacationDetails.vacationStartedAt = new Date().toJSON()
  const ref = `${VACATION_USER_DETAILS}/${userId}/0`
  firebase.database().ref(ref).set(vacationDetails)
}

const setVacationDetailsEnded = (userId, vacationDetails) => {
  vacationDetails.vacationEnded = true
  vacationDetails.vacationEndedAt = new Date().toJSON()
  const ref = `${VACATION_USER_DETAILS}/${userId}/0`
  firebase.database().ref(ref).set(vacationDetails)
}

export {
  storeVacationInfo,
  checkVacationStartToday,
  checkVacationEndToday,
  getVacationDetails,
  setVacationDetailsStarted,
  setVacationDetailsEnded,
  storeTeamToken,
  getAllTokens,
  getTeamApiToken,
  getUserTeamId,
  setupDevTeam,
  storeChannelNotificationInfo,
  getUserVacationDetails,
  init
}
