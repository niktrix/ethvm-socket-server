import { errors, eth, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import _ from 'lodash'

const getTxPagesEvent: SocketEvent = {
  name: 'getTransactionPages',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    if (payload.hash && (!eth.isBufferObject(payload.hash, 32) || !_.isNumber(payload.number))) {
      logger.error(`event -> getTransactionPages / Invalid payload: ${payload}`)
      cb(errors.notBuffer, null)
      return
    }

    server.rdb
      .getTxsPages(payload.number, payload.hash)
      .then((result: any): void => cb(null, result))
      .catch((error: Error) => {
        logger.error(`event -> getTransactionPages / Error: ${error}`)
        cb(errors.serverError, null)
      })
  }
}

export default getTxPagesEvent
