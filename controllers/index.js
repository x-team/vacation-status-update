import express from 'express'
import slashCommandController from './slashCommandController'

const router = new express.Router()

router.use(slashCommandController)

export default router
