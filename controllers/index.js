import express from 'express'
import slashCommandController from './slashCommand'
import authController from './auth'
import interactiveMessagesController from './interactiveMessages'
import wakeController from './wake'

const router = new express.Router()

router.use(slashCommandController)
router.use(authController)
router.use(interactiveMessagesController)
router.use(wakeController)

export default router
