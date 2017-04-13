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
    convo.addQuestion('Awesome. And what day will you be back?',[
      {
        default: true,
        callback: function(response, convo) {
          convo.setVar('vacation_end', response.text);
          convo.gotoThread('thanks')
        }
      }
    ],{},'end_vacation')

    convo.addQuestion('Noice! Well, I can remind the team about your vacation for you once you\'re gone. What day will your vacation start?',[
      {
        default: true,
        callback: (response, convo) => {
          convo.setVar('vacation_start', response.text)
          convo.gotoThread('end_vacation')
        }
      }
    ],{},'yes_thread')

    convo.addMessage({
        text: 'Oh, got it :slightly_smiling_face: Just a heads up, you can always message me when you set your vacation plans, and I will update your profile name for you so people know you are away when they try to message you :slightly_smiling_face: ',
    },'no_thread')

    convo.addQuestion('Got it. So then, your vacation is between {{vars.vacation_start}} and {{vars.vacation_end}}. I will update your profile name with OOO when you leave so the team knows you are not available. Is that alright?', [
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

    convo.ask('Hey there! Did I hear you say you\'re going on vacation?', [
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
