import { AddressValidator, errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { AddressPayload } from '@app/models'
import { EthVMServer, SocketEvent } from '@app/server'

const getTotalTxsEvent: SocketEvent = {
  name: 'getTotalTxs',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    const isValid = AddressValidator(msg)
    if (!isValid) {
      logger.error(`event -> getTotalTxs / Invalid payload: ${msg}`)
      cb(AddressValidator.errors, null)
      return
    }

    const payload: AddressPayload = JSON.parse(msg)

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
