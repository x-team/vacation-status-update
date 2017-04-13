import firebase from 'firebase'

const VACATION_START = 'start'
const VACATION_END = 'end'
const VACATION_DATES_ENDPOINT = 'dates'
const VACATION_USER_DETAILS = 'users'
const config = {
  apiKey: process.env.firebase_config_apikey,
  authDomain: process.env.firebase_config_authdomain,
  databaseURL: process.env.firebase_config_databaseurl,
  storageBucket: process.env.firebase_config_storagebucket,
  messagingSenderId: process.env.firebase_config_messagingsenderid
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
  const data = {user: userId, startDate: startDate, endDate: endDate, lastName: lastName, status: status}
  const ref = `${VACATION_USER_DETAILS}/${userId}/${startDate.year}${startDate.month}${startDate.day}${endDate.year}${endDate.month}${endDate.day}`
  firebase.database().ref(ref).set(data)
}

export {
  storeVacationStart,
  storeVacationEnd,
  storeVacationDetails
}
