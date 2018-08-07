import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTxEvent: SocketEvent = {
  name: 'getTx',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = validators.txsPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getTx / Invalid payload: ${payload}`)
      cb(validators.txsPayloadValidator.errors, null)
      return
    }

    server.rdb
      .getTx(payload.hash)
      .then((result: any): void => cb(null, result))
      .catch((error: Error) => {
        logger.error(`event -> getTx / Error: ${error}`)
        cb(errors.serverError, null)
      })
  }
}

export default getTxEvent
