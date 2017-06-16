const formatStatus = (endDate) => {
  return `OOO until ${endDate.fancy}`
}

const formatChannelsToOptions = (channels) => {
  let options = []
  channels.forEach((channel) => {
    options.push({text: channel.name, value: channel.id})
  })

  return options
}

export {
  formatStatus,
  formatChannelsToOptions,
}
