import bodyParser from 'body-parser'
import * as botHandler from './handler/bot'

botHandler.listener.hears(['vacation', 'holiday', 'ooo', 'time off'], ['ambient'], (bot, message) => {
  botHandler.startVacationRequestConversation(message.user)
})

var port = process.env.PORT || 3000
