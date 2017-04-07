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
    convo.addQuestion('Noice! And when are you back at X-Team?',[
      {
        default: true,
        callback: function(response,convo) {
          console.log('Vacation ends: ', response.text)
          convo.next();
        }
      }
    ],{},'end_vacation');

    convo.addQuestion('Great! What time shall your vacation start ?',[
      {
        default: true,
        callback: function(response,convo) {
          console.log('Vacation starts: ', response.text)
          convo.gotoThread('end_vacation');
        }
      }
    ],{},'yes_thread');

    convo.addMessage({
        text: 'Right ... Sorry! Must have missheard something. Pleas don\'t tell my boss...',
    },'no_thread');

    convo.addMessage({
        text: 'Sorry I did not understand.',
        action: 'default',
    },'bad_response');

    convo.ask('I can\'t help to notice that you have mentioned something about vacation ... Is that correct?', [
        {
            pattern: bot.utterances.yes,
            callback: (response, convo) => {
                convo.gotoThread('yes_thread');
            },
        },
        {
            pattern: bot.utterances.no,
            callback: (response, convo) => {
                convo.gotoThread('no_thread');
            },
        },
        {
            default: true,
            callback: (response, convo) => {
                convo.gotoThread('bad_response');
            },
        }
    ]);

    convo.activate();
  })
}

export {
  listener,
  startVacationRequestConversation
}
