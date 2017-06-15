import express from 'express'

const router = new express.Router()

router.get('/wakeup', async function (req, res) {
  res.send('I wasn\'t sleeping ...')
})

router.post('/wakeup', async function (req, res) {
  res.send('I wasn\'t sleeping ...')
})

export default router
