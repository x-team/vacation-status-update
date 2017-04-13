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

const handleStartDateAnswer = (response, convo) => {
  const isValidDate = dateUtil.validate(response.text)
  if (isValidDate) {
    const startDate = dateUtil.guessDate(response.text)
    convo.setVar('startDate', startDate)
    convo.gotoThread('confirm_start_date')
  } else {
    convo.gotoThread('remind_date_format')
  }
}

const handleEndtDateAnswer = (response, convo) => {
  const isValidDate = dateUtil.validate(response.text)
  if (isValidDate) {
    const endDate = dateUtil.guessDate(response.text)
    convo.setVar('endDate', endDate)
    convo.gotoThread('confirm_end_date')
  } else {
    convo.gotoThread('remind_date_format')
  }
}

const startVacationRequestConversation = (user) => {
  bot.startPrivateConversation({user: user}, (err, convo) => {
    convo.addQuestion('Groovy. And what day will you be back?',[
      {
        default: true,
        callback: (response, convo) => { handleEndtDateAnswer(response, convo) }
      }
    ],{},'end_vacation')

    convo.addQuestion(`Alright, is that {{vars.startDate.fancy}}?`, [
      {
          pattern: bot.utterances.yes,
          callback: (response, convo) => {
              console.log('confirmend start date')
              convo.gotoThread('end_vacation')
          }
      },
      {
          pattern: bot.utterances.no,
          callback: (response, convo) => {
              console.log('declined start date')
          }
      }
    ],{},'confirm_start_date')

    convo.addQuestion(`Alright, is that {{vars.endDate.fancy}}?`, [
      {
          pattern: bot.utterances.yes,
          callback: (response, convo) => {
              console.log('confirmend end date')
              convo.gotoThread('thanks')
          }
      },
      {
          pattern: bot.utterances.no,
          callback: (response, convo) => {
              console.log('declined start date')
          }
      }
    ],{},'confirm_end_date')

    convo.addQuestion('Please provide date in format dd/mm/yyyy',[
      {
        default: true,
        callback: (response, convo) => {
          console.log('done')
        }
      }
    ],{},'remind_date_format')

    convo.addQuestion('Lucky! I\'m dying for a weekend getaway. Well, I can remind the team about your vacation for you once you\'re gone. What day will your vacation start? (format: dd/mm/yyyy)',[
      {
        default: true,
        callback: (response, convo) => { handleStartDateAnswer(response, convo) }
      }
    ],{},'yes_thread')

    convo.addMessage({
        text: 'Oh, nevermind then. Well, anyway, my yacht is pulling up -- Hamptons here I come, baby! :sunglasses:',
    },'no_thread')

    convo.addQuestion('Bingo! Got it. I will remind the team that your vacation will take place between {{vars.startDate.fancy}} and {{vars.endDate.fancy}}. Is that correct?', [
      {
          pattern: bot.utterances.yes,
          callback: async function(response, convo) {
            let userData = await apiHandler.getUserData(response.user)
            storeHandler.storeVacationInfo(response.user, userData, convo.vars.startDate, convo.vars.endDate)
            convo.gotoThread('end')
          }
      }
    ],{},'thanks')

    convo.addMessage({
        text: 'Can you rephrase?',
        action: 'default',
    },'bad_response')

    convo.addMessage({
        text: 'Thanks!',
        action: 'default',
    },'end')

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
