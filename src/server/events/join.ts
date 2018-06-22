import { logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const joinEvent: SocketEvent = {
  name: 'join',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (!msg) {
      logger.error(socket.id, 'tried to join invalid room', msg)
      return
    }

    socket.join(msg)
  }
}

export default joinEvent
