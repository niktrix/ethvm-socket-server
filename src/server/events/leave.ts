import { logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const leaveEvent: SocketEvent = {
  name: 'leave',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = validators.leavePayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> join / ${socket.id} tried to join invalid room with msg: ${payload}`)
      cb(validators.leavePayloadValidator.errors, null)
      return
    }

    logger.debug(`event -> leave / Leaving room: ${payload}`)
    socket.leave(payload)
  }
}

export default leaveEvent
