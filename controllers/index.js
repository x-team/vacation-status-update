import express from 'express'
import slashCommandController from './slashCommandController'
import authController from './authController'
import interactiveMessagesController from './interactiveMessagesController'
import wakeController from './wakeController'

const router = new express.Router()

router.use(slashCommandController)
router.use(authController)
router.use(interactiveMessagesController)
router.use(wakeController)

export default router
