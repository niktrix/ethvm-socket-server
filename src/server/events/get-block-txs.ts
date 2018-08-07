import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getBlockTxsEvent: SocketEvent = {
  name: 'getBlockTransactions',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = validators.blockTxsPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getBlockTransactions / Invalid payload: ${payload}`)
      cb(validators.blockTxsPayloadValidator.errors, null)
      return
    }

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
