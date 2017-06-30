# vacation-status-update
Slack integration helping to communicate your vacation time off to team members

# Adding to Slack

Please visit: https://x-team.com/vacation-bot/ for installation button

After installation, invite bot user to desired channel.

If in channel vacation will be discussed, bot will DM author of message and follow up.

# Issues

Please submit any issues to issues section

# Contributing

1. Create firebase project

- by using "Add firebase to your web app, copy all configuration details"

- create `.env` from `.env.TEMPLATE` and fill in firebase config data

- go to authentication and enable `anonymous` sign in method

2. Create development Slack application

- you need to be a team admin to install vacation bot

- go to api.slack.com and create new application

- your application needs to have those scopes in `OAuth & Permissions`:

bot

commands

users.profile:write

admin

dnd:write

channels:read

channels:write

groups:read

groups:write

and your redirect url defined: http://yourdomain.com/api/auth (or https) Note: this url for testing can be your localhost as well.

- your app needs to have bot user created

- your app needs to have `interactive messages` endpoint configured: https://yourdomain.com/api/im ( I recommend heroku.com ) Note: this url needs to publicly accessible https endpoint.

- your can now copy all slack configuration data from:

`Basic information`:

slack_app_client_id=xxx

slack_app_client_secret=xxx

`OAuth & Permissions`:

slack_api_token=xxx

slack_bot_token=xxx

slack_app_redirect_uri=xxx
