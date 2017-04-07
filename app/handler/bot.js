import Botkit from 'botkit'

if (!process.env.slack_bot_token) {
    console.log('Error: Specify token in environment')
    process.exit(1)
}
const listener = Botkit.slackbot({
    debug: false,
    stats_optout: false
});

const bot = listener.spawn({
    token: process.env.slack_bot_token
}).startRTM()

const startVacationRequestConversation = (user) => {
  bot.startPrivateConversation({user: user}, (err, convo) => {
    if (err) {
        console.log('error', err)
    } else {
      convo.ask('Are you planning vacation?', (message, convo) => {
        convo.next()
      })
    }
  })
}

export {
  listener,
  startVacationRequestConversation
}
