import express from 'express'

const router = new express.Router()

router.get('/', async (req, res) => {
    res.send('this is dashboard')
})

export default router
