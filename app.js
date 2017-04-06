import bodyParser from 'body-parser'
import express from 'express'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 3000
app.listen(port)

app.get('/', async function (req, res) {
  res.send('Hello')
})
