import Botkit from 'botkit'
import * as storeHandler from './store'
import * as apiHandler from '../handlers/api'
import * as dateUtil from '../util/date'

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
    convo.addQuestion('Groovy. And what day will you be back?',[
      {
        default: true,
        callback: function(response, convo) {
          convo.setVar('vacation_end', response.text);
          convo.gotoThread('thanks')
        }
      }
    ],{},'end_vacation')

    convo.addQuestion('Lucky! I\'m dying for a weekend getaway. Well, I can remind the team about your vacation for you once you\'re gone. What day will your vacation start?',[
      {
        default: true,
        callback: (response, convo) => {
          convo.setVar('vacation_start', response.text)
          convo.gotoThread('end_vacation')
        }
      }
    ],{},'yes_thread')

    convo.addMessage({
        text: 'Oh, nevermind then. Well, anyway, my yacht is pulling up -- Hamptons here I come, baby! :sunglasses:',
    },'no_thread')

    convo.addQuestion('Bingo! Got it. I will remind the team that your vacation will take place between {{vars.vacation_start}} and {{vars.vacation_end}}. Is that alright?', [
      {
          pattern: bot.utterances.yes,
          callback: async function(response, convo) {
            let userData = await apiHandler.getUserData(response.user)
            const startDate = dateUtil.getStartDateFromAnswer(convo.vars.vacation_start)
            const endDate = dateUtil.getStartDateFromAnswer(convo.vars.vacation_end)
            storeHandler.storeVacationInfo(response.user, userData, startDate, endDate)
          }
      }
    ],{},'thanks')

    convo.addMessage({
        text: 'Can you rephrase?',
        action: 'default',
    },'bad_response')

    convo.ask('Heya! Bernie here, did I hear you say you\'re going on vacation?', [
        {
            pattern: bot.utterances.yes,
            callback: (response, convo) => {
                convo.gotoThread('yes_thread')
            },
        },
        {
            pattern: bot.utterances.no,
            callback: (response, convo) => {
                convo.gotoThread('no_thread')
            },
        },
        {
            default: true,
            callback: (response, convo) => {
                convo.gotoThread('bad_response')
            },
        }
    ]);

    convo.activate()
  })
}

export {
  listener,
  startVacationRequestConversation
}
