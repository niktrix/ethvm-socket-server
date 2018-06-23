import { errors, eth } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import _ from 'lodash'

const getAddressTxPagesEvent: SocketEvent = {
  name: 'getAddressTransactionPages',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (msg.hash && (!eth.isBufferObject(msg.hash, 32) || !_.isNumber(msg.number))) {
      cb(errors.notBuffer, null)
      return
    }

    if (!eth.isBufferObject(msg.address, 20)) {
      cb(errors.notBuffer, null)
      return
    }

    server.rdb.getAddressTransactionPages(msg.address, msg.hash, msg.number, cb)
  }
}

export default getAddressTxPagesEvent
