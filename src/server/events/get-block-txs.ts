import { AddressValidator, errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { AddressPayload } from '@app/models'
import { EthVMServer, SocketEvent } from '@app/server'

const getBlockTxsEvent: SocketEvent = {
  name: 'getBlockTransactions',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    const isValid = AddressValidator(msg)
    if (!isValid) {
      logger.error(`event -> getBlockTransactions / Invalid payload: ${msg}`)
      cb(AddressValidator.errors, null)
      return
    }

    const payload: AddressPayload = JSON.parse(msg)

    server.rdb
      .getBlockTxs(payload.address)
      .then((result: any): void => cb(null, result))
      .catch((error: Error) => {
        logger.error(`event -> getBlockTransactions / Error: ${error}`)
        cb(errors.serverError, null)
      })
  }
}

export default getBlockTxsEvent
