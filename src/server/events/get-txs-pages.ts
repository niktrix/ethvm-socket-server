import { errors, eth } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import _ from 'lodash'

const getTxPagesEvent: SocketEvent = {
  name: 'getTransactionPages',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (msg.hash && (!eth.isBufferObject(msg.hash, 32) || !_.isNumber(msg.number))) {
      cb(errors.notBuffer, null)
      return
    }

    server.rdb
      .getTransactionPages(msg.hash, msg.number)
      .then((result: any): void => cb(null, result))
      .catch((error: Error) => cb(error, null))
  }
}

export default getTxPagesEvent
