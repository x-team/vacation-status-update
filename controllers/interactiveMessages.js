import express from 'express'
import { storeChannelNotificationInfo, storeListenerChannelId} from '../handlers/store'
import { inviteBotToChannel, inviteBotToGroup } from '../handlers/api'

const router = new express.Router()

router.post('/im', async function (req, res) {
    if (req.body.payload) {
        const payload = JSON.parse(req.body.payload)
        if (payload.actions[0].type === 'select' && payload.callback_id === 'notify_team') {
            const channelId = payload.actions[0].selected_options[0].value
            const userId = payload.user.id
            storeChannelNotificationInfo(userId, channelId)
        } else if (payload.actions[0].type === 'select' && payload.callback_id === 'invite_bot') {
            const channelId = payload.actions[0].selected_options[0].value
            const userId = payload.user.id
            const teamId = payload.team.id
            storeListenerChannelId(teamId, userId, channelId)
            switch (payload.actions[0].name) {
            case 'groups_list':
                inviteBotToGroup(teamId, channelId)
                break
            case 'channels_list':
                inviteBotToChannel(teamId, channelId)
                break
            }
        }
    }
    res.send('Thanks!')
})

export default router
