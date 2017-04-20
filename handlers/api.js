import slack from 'slack-node'
const slackClient = new slack(process.env.slack_api_token)

const changeUserProfile = (userId, text, emoji) => {
  return new Promise((resolve, reject) => {
    const profile = `{"status_text":"${text}","status_emoji": "${emoji}"}`
    const apiCallData = { user: userId, profile: profile}
    slackClient.api('users.profile.set', apiCallData, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

const getUserData = (userId) => {
  return new Promise((resolve, reject) => {
    slackClient.api('users.info', {user: userId}, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response.user.profile)
      }
    })
  })
}

export {
  changeUserProfile,
  getUserData
}
