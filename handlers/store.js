import firebase from 'firebase'
import * as formatterUtil from '../util/formatter'
import * as dateUtil from '../util/date'

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

const app = firebase.initializeApp(config)

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

const storeVacationDetails = (userId, startDate, endDate, lastName, status) => {
  const data = {user: userId, startDate: startDate, endDate: endDate, status: status}
  const ref = `${VACATION_USER_DETAILS}/${userId}/0`
  firebase.database().ref(ref).set(data)
}

const storeVacationInfo = (userId, startDate, endDate) => {
  const status = formatterUtil.formatStatus(endDate)
  storeVacationStart(startDate, userId)
  storeVacationEnd(endDate, userId)
  storeVacationDetails(userId, startDate, endDate, status)
}

const storeTeamToken = (token) => {
  const botData = { botToken: token.bot.bot_access_token, botUserId: token.bot.bot_user_id }
  const data = { teamId: token.team_id, bot: botData, token: token.access_token }
  const ref = `${VACATION_TOKENS}/${token.team_id}`
  firebase.database().ref(ref).set(data)
}

const getAllTokens = () => {
  return new Promise((resolve, reject) => {
    const teamsTokens = firebase.database().ref(VACATION_TOKENS)
      teamsTokens.once('value', (snapshot) => {
        let tokens = []
        const snaps = snapshot.val()
        for (var key in snaps) {
          if (snaps.hasOwnProperty(key)) {
            tokens.push(snaps[key].bot.botToken)
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
  const ref = `${VACATION_USER_DETAILS}/${userId}/0`
  firebase.database().ref(ref).set(vacationDetails)
}

const setVacationDetailsEnded = (userId, vacationDetails) => {
  vacationDetails.vacationEnded = true
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
  getAllTokens
}
