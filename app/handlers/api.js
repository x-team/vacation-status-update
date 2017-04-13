import slack from 'slack-node'
const slackClient = new slack(process.env.slack_api_token)

const changeUserProfile = (userId, value) => {
  return new Promise((resolve, reject) => {
    slackClient.api('users.profile.set', {user: userId, name: 'last_name', value: value}, () => {
      resolve(true)
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
