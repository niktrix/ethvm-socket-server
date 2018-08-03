import { logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const leaveEvent: SocketEvent = {
  name: 'leave',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (!msg) {
      logger.error(`event -> leave / ${socket.id} tried to leave invalid room with msg: ${msg}`)
      return
    }

    logger.error(`event -> leave / Leaving room: ${msg}`)
    socket.leave(msg)
  }
}

export default leaveEvent
