import { errors, eth, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import _ from 'lodash'

const getTxPagesEvent: SocketEvent = {
  name: 'getTransactionPages',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (msg.hash && (!eth.isBufferObject(msg.hash, 32) || !_.isNumber(msg.number))) {
      logger.error(`event -> getTransactionPages / Invalid payload: ${msg}`)
      cb(errors.notBuffer, null)
      return
    }

    server.rdb
      .getTxsPages(msg.number, msg.hash)
      .then((result: any): void => cb(null, result))
      .catch((error: Error) => {
        logger.error(`event -> getTransactionPages / Error: ${error}`)
        cb(errors.serverError, null)
      })
  }
}

export default getTxPagesEvent
