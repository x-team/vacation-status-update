# Contributing

### Create firebase project

* by using "Add firebase to your web app, copy all configuration details"

* create `.env` from `.env.TEMPLATE` and fill in firebase config data

* go to authentication and enable `anonymous` sign in method


### Create development Slack application

* you need to be a team admin to install vacation bot
* go to api.slack.com and create new application
* your application needs to have those scopes in `OAuth & Permissions`:```bot,commands,users.profile:write,admin,dnd:write,channels:read,channels:write,groups:read,groups:write``` and your redirect url defined: http://yourdomain.com/api/auth (or https) Note: this url for testing can be your localhost as well.

* your app needs to have bot user created
* your app needs to have `interactive messages` endpoint configured: https://yourdomain.com/api/im ( I recommend heroku.com ) Note: this url needs to publicly accessible https endpoint.
* your can now copy all slack configuration data from:

`Basic information`:

* slack_app_client_id=xxx

* slack_app_client_secret=xxx

`OAuth & Permissions`:

* slack_api_token=xxx

* slack_bot_token=xxx


# Heroku

I do recommend using Heroku for local and server side development. It is very easy to deploy and setup on both environments and it's free. It provides https endpoints by default as well.

Install heroku CLI on your local machine to use `heroku local` functionalities.

Some of the functionalities of the application you will be able to test without deploying to public server, like:

* bot websockets RTM connection, slack web API connection, hosting add to slack button and others

You will not be able to host public endpoints which are needed for two actions:

* authorizing application for installing to slack team
* interactive messages request handling

For those I recommend deploying to Heroku but you can also use other services and tunneling for local environment, such as localtunnel or ngrok ( the connection will be dependent on your internet)

# Issues

If you come up with improvement, new feature or bug: Please create new issue in [Issues section](https://github.com/jacekelgda/vacation-status-update/issues).

# Github workflow

* Please fork this repository first.
* Please provide a PR to master branch.
* Please use smart commit messages: `git commit -m 'Installation fixes --closes #123'` where `#123` being github issue key.
* Remember to always work with the latest `master` branch version.

## Thanks for contributing!
