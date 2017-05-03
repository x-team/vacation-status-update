import express from 'express'
import slashCommandController from './slashCommandController'
import authController from './authController'

const router = new express.Router()

router.use(slashCommandController)
router.use(authController)

export default router
