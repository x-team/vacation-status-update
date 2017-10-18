import firebase from 'firebase'
import * as formatterUtil from '../util/formatter'
import * as dateUtil from '../util/date'
import * as apiHandler from './api'

const VACATION_START = 'start'
const VACATION_END = 'end'
const VACATION_DATES_ENDPOINT = 'dates'
const VACATION_USER_DETAILS = 'users'
const VACATION_LIST = 'vacations'
const VACATION_TOKENS = 'tokens'
const CHANNELS = 'channels'
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

const removeVacationStart = (date, userId) => {
  const ref = `${VACATION_DATES_ENDPOINT}/${date.year}/${date.month}/${date.day}/${VACATION_START}/${userId}`

  firebase.database().ref(ref).remove()
}

const storeVacationEnd = (date, userId) => {
    const data = { user: userId, date: date, type: VACATION_END}
    const ref = `${VACATION_DATES_ENDPOINT}/${date.year}/${date.month}/${date.day}/${VACATION_END}/${userId}`

    firebase.database().ref(ref).set(data)
}

const removeVacationEnd = (date, userId) => {
    const ref = `${VACATION_DATES_ENDPOINT}/${date.year}/${date.month}/${date.day}/${VACATION_END}/${userId}`

    firebase.database().ref(ref).remove()
}

const storeVacationDetails = (userData, startDate, endDate, status) => {
    const data = {user: userData.userId, team: userData.teamId, startDate: startDate, endDate: endDate, status: status}
    const ref = `${VACATION_USER_DETAILS}/${userData.userId}/0`

    firebase.database().ref(ref).set(data)
}

const removeVacationDetails = (userId) => {
    const ref = `${VACATION_USER_DETAILS}/${userId}/0`

    firebase.database().ref(ref).remove()
}

const storeVacationInfo = (userData, startDate, endDate) => {
    const status = formatterUtil.formatStatus(endDate)

    removeAllPreviousVacations(userData.userId)
    storeVacationStart(startDate, userData.userId)
    storeVacationEnd(endDate, userData.userId)
    storeVacationDetails(userData, startDate, endDate, status)
}

const storeChannelNotificationInfo = (userId, channelId) => {
    const ref = `${VACATION_USER_DETAILS}/${userId}/0/channel`

    firebase.database().ref(ref).set({ id: channelId })
}

const storeListenerChannelId = (team, user, channel) => {
    const ref = `${CHANNELS}/${team}`

    firebase.database().ref(ref).set({ team, user, channel })
}

const storeTeamToken = (token) => {
    const botData = { botToken: token.bot.bot_access_token, botUserId: token.bot.bot_user_id }
    const data = { teamId: token.team_id, bot: botData, token: token.access_token }
    const ref = `${VACATION_TOKENS}/${token.team_id}`

    firebase.database().ref(ref).set(data)
}

const setupDevTeam = async () => {
    const devBotData = await apiHandler.identifyDevBotData()
    const botData = { bot_access_token: process.env.slack_bot_token, bot_user_id: devBotData.user_id }
    const tokenData = { bot: botData, team_id: devBotData.team_id, access_token: process.env.slack_api_token }

    storeTeamToken(tokenData)
}

const getTeamApiToken = (teamId) =>
    firebase.database().ref(`${VACATION_TOKENS}/${teamId}`).once('value').then(snap => snap.val().token)

const getBotToken = (teamId) =>
    firebase.database().ref(`${VACATION_TOKENS}/${teamId}`).once('value').then(snap => snap.val().bot.botToken)

const getUserTeamId = (userId) =>
    firebase.database().ref(`${VACATION_USER_DETAILS}/${userId}/0`).then(snap => snap.val().team)

const getUserVacationDetails = (userId) =>
    firebase.database().ref(`${VACATION_USER_DETAILS}/${userId}/0`).once('value').then(snap => snap.val())

const getAllTokens = () =>
    firebase.database().ref(VACATION_TOKENS).once('value')
        .then(snapshot => {
            const tokens = []
            const snaps = snapshot.val()
            for (let key in snaps) {
                if (snaps.hasOwnProperty(key)) {
                    tokens.push({ token: snaps[key].bot.botToken, team: key })
                }
            }

            return tokens
        })

const checkVacationStartToday = () => {
    return new Promise((resolve) => {
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
    return new Promise((resolve) => {
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

const getVacationDetails = (userId) =>
    firebase.database().ref(`${VACATION_USER_DETAILS}/${userId}`).once('value').then(snap => snap.val())

const setVacationDetailsStarted = (userId, vacationDetails) => {
    vacationDetails.vacationStarted = true
    vacationDetails.vacationStartedAt = new Date().toJSON()
    const ref = `${VACATION_USER_DETAILS}/${userId}/0`

    firebase.database().ref(ref).set(vacationDetails)
}

const addToOnVacationList = (userId, vacationDetails) => {
    const ref = `${VACATION_LIST}/${vacationDetails.team}/${userId}`

    firebase.database().ref(ref).set({ onVacation: true })
}

const removeFromOnVacationsList = (userId, vacationDetails) => {
    const ref = `${VACATION_LIST}/${vacationDetails.team}/${userId}`

    firebase.database().ref(ref).remove()
}

const setVacationDetailsEnded = (userId, vacationDetails) => {
    vacationDetails.vacationEnded = true
    vacationDetails.vacationEndedAt = new Date().toJSON()
    const ref = `${VACATION_USER_DETAILS}/${userId}/0`

    firebase.database().ref(ref).set(vacationDetails)
}

const filterUsersOnVacation = async (users, team) => {
    let filteredUserIds = []
    for (let key in users) {
        const userId = users[key]
        if (await checkIsUserOnVacation(userId, team)) {
            filteredUserIds.push(userId)
        }
    }

    return new Promise((resolve) => {
        resolve(filteredUserIds)
    })
}

const getAllTeamsWithUsersOnVacation = () =>
    firebase.database().ref(VACATION_LIST).once('value').then(snap => snap.val())

const getAllUsersOnVacationByDate = (date, token) =>
    firebase.database().ref(VACATION_USER_DETAILS).once('value').then(async snap => {
        const users = snap.val()
        const filteredUsers = []

        for (let user in users) {
            const startDate = new Date(users[user][0].startDate.fancy)
            const endDate = new Date(users[user][0].endDate.fancy)

            if (startDate.getTime() < date && endDate.getTime() > date) {
                const userData = await apiHandler.getUserData(token, user)
                filteredUsers.push(`@${userData.real_name}`)
            }
        }

        if (filteredUsers.length === 0) {
            return 'No one is OOO then'
        }

        return filteredUsers
    })

const checkIsUserOnVacation = (user, team) =>
    firebase.database().ref(`${VACATION_LIST}/${team}/${user}`).once('value').then(snap => snap.val())

const cleanupStartDate = (userId) => {
    const date = dateUtil.getTodayDateObject()
    const ref = `${VACATION_DATES_ENDPOINT}/${date.year}/${date.month}/${date.day}/${VACATION_START}/${userId}`
    firebase.database().ref(ref).remove()
}

const cleanupEndDate = (userId) => {
    const date = dateUtil.getTodayDateObject()
    const ref = `${VACATION_DATES_ENDPOINT}/${date.year}/${date.month}/${date.day}/${VACATION_END}/${userId}`
    firebase.database().ref(ref).remove()
}

const removeAllPreviousVacations = (userId) => {
  getVacationDetails(userId).then(vacationDetails => {
    if (vacationDetails) {
      vacationDetails.forEach((vacationDetail) => {
        removeVacationStart(vacationDetail.startDate, userId)
        removeVacationEnd(vacationDetail.endDate, userId)
        removeVacationDetails(userId)
      })
    }
  })
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
    getAllUsersOnVacationByDate,
    setupDevTeam,
    storeChannelNotificationInfo,
    getUserVacationDetails,
    init,
    getBotToken,
    filterUsersOnVacation,
    addToOnVacationList,
    removeFromOnVacationsList,
    getAllTeamsWithUsersOnVacation,
    cleanupStartDate,
    cleanupEndDate,
    storeListenerChannelId,
}
