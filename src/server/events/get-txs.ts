import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTxsEvent: SocketEvent = {
  name: 'getTxs', // new_name: address_txs
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = validators.txsPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getTxs / Invalid payload: ${payload}`)
      cb(validators.txsPayloadValidator.errors, null)
      return
    }

    server.rdb
      .getTxsOfAddress(payload.address, payload.limit, payload.page)
      .then(result => cb(null, result))
      .catch(error => {
        logger.error(`event -> getTxs / Error: ${error}`)
        cb(errors.serverError, null)
      })
  }
}

export default getTxsEvent
