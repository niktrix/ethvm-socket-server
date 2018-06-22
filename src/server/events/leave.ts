import { logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const leaveEvent: SocketEvent = {
  name: 'leave',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (!msg) {
      logger.error(`${socket.id} tried to leave invalid room`)
      return
    }

    socket.leave(msg)
  }
}

export default leaveEvent
