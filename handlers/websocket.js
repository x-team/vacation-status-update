import generateConfigForDashboard from '../util/dashboard'

const websocketHandler = (socket) => {
  const config = generateConfigForDashboard()
  socket.emit('config', config)
}

export default websocketHandler
