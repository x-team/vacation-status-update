export const extractMentionedUsers = (message) => {
    const matches = message.text.match(/<@\w*>/gi) || []
    const users = matches.map((text) => {
        return text.replace(/^<@/i, '').replace(/>$/i, '')
    })

    return users
}
