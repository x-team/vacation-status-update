import slack from 'slack-node'
const slackClient = new slack(process.env.slack_api_token)

const changeUserProfile = (userId) => {
  slackClient.api('users.profile.set', {user: userId, name: 'last_name', value: 'Ławniczak'}, (err, response) => {
    console.log(response)
  })
}

export {
  changeUserProfile
}
