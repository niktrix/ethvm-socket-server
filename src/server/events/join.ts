import { logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const joinEvent: SocketEvent = {
  name: 'join',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = validators.joinPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> join / ${socket.id} tried to join invalid room with msg: ${payload}`)
      cb(validators.joinPayloadValidator.errors, null)
      return
    }

    logger.debug(`event -> join / Joining room: ${payload}`)
    socket.join(payload)
  }
}

export default joinEvent
