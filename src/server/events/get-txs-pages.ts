import { Callback } from '@app/interfaces'
import { common } from '@app/libs'
import { EthVMServer, SocketEvent } from '@app/server'

const getTxPagesEvent: SocketEvent = {
  name: 'getTransactionPages',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (msg.hash && (!common.check.isBufferObject(msg.hash, 32) || !common.check.isNumber(msg.number))) {
      cb(common.newError(common.errors.notBuffer), null)
      return
    }

    server.rdb.getTransactionPages(msg.hash, msg.number, cb)
  }
}

export default getTxPagesEvent
