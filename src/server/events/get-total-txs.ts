import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTotalTxsEvent: SocketEvent = {
  name: 'getTotalTxs',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = validators.totalTxsPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getTotalTxs / Invalid payload: ${payload}`)
      cb(validators.totalTxsPayloadValidator.errors, null)
      return
    }

    server.rdb
      .getTotalTxs(payload.address)
      .then((count: any): void => cb(null, count))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getTotalTxs / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getTotalTxsEvent
