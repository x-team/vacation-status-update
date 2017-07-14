import express from 'express'
import slashCommandController from './slashCommand'
import authController from './auth'
import interactiveMessagesController from './interactiveMessages'
import wakeController from './wake'
import dashboardController from './dashboard'

const api = new express.Router()
const dashboard = new express.Router()

api.use(slashCommandController)
api.use(authController)
api.use(interactiveMessagesController)
api.use(wakeController)

dashboard.use(dashboardController)

export default {
  api, dashboard
}
