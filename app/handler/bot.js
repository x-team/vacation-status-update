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

export {
  listener
}
