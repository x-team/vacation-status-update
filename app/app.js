import bodyParser from 'body-parser'
import localtunnel from 'localtunnel'
import express from 'express'
import router from './controllers'
import * as botHandler from './handlers/bot'

const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', router)
app.listen(port)

botHandler.listener.hears(['vacation', 'holiday', 'ooo', 'time off'], ['ambient'], (bot, message) => {
  botHandler.startVacationRequestConversation(message.user)
})

if (!process.env.is_prod) {
  const opts = { subdomain:process.env.localtunnel_subdomain }
  const tunnel = localtunnel(port, opts, (err, tunnel) => {
      console.log('localtunnel url:', tunnel.url)
  })
}

app.get('/', async function (req, res) {
  res.send('Hello')
})
