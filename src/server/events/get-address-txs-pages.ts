import { Callback } from '@app/interfaces'
import { common } from '@app/libs'
import { EthVMServer, SocketEvent } from '@app/server'

const getAddressTxPagesEvent: SocketEvent =   {
  name: 'getAddressTransactionPages',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (msg.hash && (!common.check.isBufferObject(msg.hash, 32) || !common.check.isNumber(msg.number))) {
      cb(common.newError(common.errors.notBuffer), null)
      return
    }

    if (!common.check.isBufferObject(msg.address, 20)) {
      cb(common.newError(common.errors.notBuffer), null)
      return
    }

    server.rdb.getAddressTransactionPages(msg.address, msg.hash, msg.number, cb)
  }
}

export default getAddressTxPagesEvent
