import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getBlockEvent: SocketEvent = {
  name: 'getBlock',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = validators.blockPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getBlock / Invalid payload: ${payload}`)
      cb(validators.blockPayloadValidator.errors, null)
      return
    }

    server.rdb
      .getBlock(payload.address)
      .then((result: any): void => cb(null, result))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getBlock / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getBlockEvent
