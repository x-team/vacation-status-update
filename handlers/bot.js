import Botkit from 'botkit'
import * as storeHandler from './store'
import * as apiHandler from '../handlers/api'
import * as dateUtil from '../util/date'
import { formatChannelsToOptions } from '../util/formatter'

let bots = []

const listener = Botkit.slackbot({
    debug: false,
    stats_optout: false
});

const createNewBotConnection = (token) => {
  const bot = listener.spawn({ token: token.token }).startRTM()
  bots[token.team] = bot

  return bot
}

const resumeAllConnections = (tokens) => {
  for ( const key in tokens ) {
    createNewBotConnection(tokens[key])
  }
}

const handleStartDateAnswer = (response, convo) => {
  const isValidDate = dateUtil.validate(response.text)
  if (isValidDate) {
    const startDate = dateUtil.guessDate(response.text)
    convo.setVar('startDate', startDate)
    convo.gotoThread('confirm_start_date')
  } else {
    convo.gotoThread('remind_start_date_format')
  }
}

const handleEndDateAnswer = (response, convo) => {
  const isValidDate = dateUtil.validate(response.text)
  if (isValidDate) {
    const endDate = dateUtil.guessDate(response.text)
    convo.setVar('endDate', endDate)
    convo.gotoThread('confirm_end_date')
  } else {
    convo.gotoThread('remind_end_date_format')
  }
}

const startVacationRequestConversation = (bot, user) => {
  bot.startPrivateConversation({user: user}, (err, convo) => {
    convo.addQuestion(`Awesome. And what day will you be back? (Use ${dateUtil.FORMAT} again)`,[
      {
        default: true,
        callback: (response, convo) => { handleEndDateAnswer(response, convo) }
      }
    ],{},'end_vacation')

    convo.addQuestion(`Alright, is that {{vars.startDate.fancy}}?`, [
      {
          pattern: bot.utterances.yes,
          callback: (response, convo) => {
              convo.gotoThread('end_vacation')
          }
      },
      {
          pattern: bot.utterances.no,
          callback: (response, convo) => {
            convo.gotoThread('try_providing_start_date_again')
          }
      }
    ],{},'confirm_start_date')

    convo.addQuestion(`Alright, is that {{vars.endDate.fancy}}?`, [
      {
          pattern: bot.utterances.yes,
          callback: (response, convo) => {
            convo.gotoThread('thanks')
          }
      },
      {
          pattern: bot.utterances.no,
          callback: (response, convo) => {
            convo.gotoThread('try_providing_end_date_again')
          }
      }
    ],{},'confirm_end_date')

    convo.addMessage({
      text: 'Would you like me to send notification to your team when your vacation starts?',
      response_type: 'in_channel',
      attachments: [
        {
          fallback: 'Select channel of your team',
          color: '#3AA3E3',
          attachment_type: 'default',
          callback_id: 'notify_team',
          actions: [
            {
              name: 'channels_list',
              text: 'Select channel of your team',
              type: 'select',
              data_source: 'channels'
            },
            {
              name: 'no',
              text: 'No, thanks!',
              value: 1,
              type: 'button',
            }
          ]
        }
      ]
    },'should_notify_channel')

    convo.addQuestion(`Do you want to try again?`, [
      {
          pattern: bot.utterances.yes,
          callback: (response, convo) => {
            convo.gotoThread('yes_thread')
          }
      },
      {
          pattern: bot.utterances.no,
          callback: (response, convo) => {
            convo.gotoThread('end')
          }
      }
    ],{},'do_you_want_to_try_again')

    convo.addQuestion(`Please provide the date in format ${dateUtil.FORMAT} (sorry, my boss is a stickler)`,[
      {
        default: true,
        callback: (response, convo) => { handleStartDateAnswer(response, convo) }
      }
    ],{},'remind_start_date_format')

    convo.addQuestion(`Please provide the date in format ${dateUtil.FORMAT} (sorry, my boss is a stickler)`, [
      {
        default: true,
        callback: (response, convo) => { handleEndDateAnswer(response, convo) }
      }
    ],{},'remind_end_date_format')

    convo.addQuestion(`Ok, let's try it again then. Please provide the start date in format ${dateUtil.FORMAT}`, [
      {
        default: true,
        callback: (response, convo) => { handleStartDateAnswer(response, convo) }
      }
    ],{},'try_providing_start_date_again')

    convo.addQuestion(`Ok, let's try it again then. Please provide the end date in format ${dateUtil.FORMAT}`, [
      {
        default: true,
        callback: (response, convo) => { handleEndDateAnswer(response, convo) }
      }
    ],{},'try_providing_end_date_again')

    convo.addQuestion(`Noice! I can update your Slack status (with a nice emoji) for you on the day you leave so you don't forget. What day will your vacation start? (Use the format: ${dateUtil.FORMAT})`,[
      {
        default: true,
        callback: (response, convo) => { handleStartDateAnswer(response, convo) }
      }
    ],{},'yes_thread')

    convo.addMessage({
        text: 'Oh, ok :slightly_smiling_face: Thought I\'d check just in case! Just a heads up, you can always message me when you set your vacation plans, and I will update your profile name for you so people know you are away when they try to message you :slightly_smiling_face:',
    },'no_thread')

    convo.addQuestion('Bingo! Got it. I will remind the team that your vacation will take place between {{vars.startDate.fancy}} and {{vars.endDate.fancy}}. Is that alright?', [
      {
        pattern: bot.utterances.yes,
        callback: async function(response, convo) {
          storeHandler.storeVacationInfo({userId: response.user, teamId: response.team}, convo.vars.startDate, convo.vars.endDate)
          convo.gotoThread('should_notify_channel')
        }
      },
      {
        pattern: bot.utterances.no,
        callback: (response, convo) => {
          convo.gotoThread('do_you_want_to_try_again')
        }
      }
    ],{},'thanks')

    convo.addMessage({
        text: 'Can you rephrase?',
        action: 'default',
    },'bad_response')

    convo.addMessage({
        text: 'Thanks!'
    },'end')

    convo.ask('Heya! VacationBot here, did I hear you say you\'re going on vacation?', [
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
            pattern: 'test',
            callback: (response, convo) => {
              storeHandler.storeVacationInfo(
                {
                  userId: response.user,
                  teamId: response.team
                },
                dateUtil.getTodayDateObject(),
                dateUtil.getTodayDateObject()
              )
              convo.gotoThread('should_notify_channel')
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

const informUserAboutVacationStart = (teamId, userId) => {
  const bot = bots[teamId]
  bot.startPrivateConversation({user: userId}, (err, convo) => {
    convo.say('Hi! I just wanted to let you know that I updated your presence status with OOO message. See you soon!')
    convo.activate()
  })
}

const informUserAboutVacationEnd = (teamId, userId) => {
  const bot = bots[teamId]
  bot.startPrivateConversation({user: userId}, (err, convo) => {
    convo.say('Hi! I just wanted to let you know that I removed OOO message from your presence status. Welcome back!')
    convo.activate()
  })
}

const markMessageWithEmoji = (bot, message) => {
  const data = {
    name: process.env.emoji_name,
    timestamp: message.ts,
    channel: message.channel,
  }
  bot.api.reactions.add(data)
}

const sendPostInstallMessage = async (bot, user, team) => {
  const privateChannels = await apiHandler.getListOfPrivateChannel(team)
  bot.startPrivateConversation({ user }, (err, convo) => {
    convo.addMessage({
      text: 'Hello!\n\nI am Vacation Bot and I am here to help your team manage Out Of Office notifications.\n\nI need to be invited to channels in which your teammates might inform about upcoming Out Of Office time.',
      response_type: 'in_channel',
      attachments: [
        {
          fallback: 'Select channel of your team',
          color: '#3AA3E3',
          attachment_type: 'default',
          callback_id: 'invite_bot',
          actions: [
            {
              name: 'channels_list',
              text: 'Public channels',
              type: 'select',
              data_source: 'channels'
            },
            {
              name: 'groups_list',
              text: 'Private channels',
              type: 'select',
              options: formatChannelsToOptions(privateChannels)
            },
          ]
        }
      ]
    },'default')
    convo.activate()
  })
}

export {
  listener,
  startVacationRequestConversation,
  createNewBotConnection,
  resumeAllConnections,
  informUserAboutVacationStart,
  informUserAboutVacationEnd,
  markMessageWithEmoji,
  sendPostInstallMessage,
  bots,
}
