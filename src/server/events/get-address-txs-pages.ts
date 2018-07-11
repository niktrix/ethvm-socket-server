import { errors, eth } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import _ from 'lodash'

const getAddressTxPagesEvent: SocketEvent = {
  name: 'getAddressTransactionPages',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if ((msg.hash && (!eth.isBufferObject(msg.hash, 32) || !_.isNumber(msg.number))) || !eth.isBufferObject(msg.address, 20)) {
      cb(errors.notBuffer, null)
      return
    }

    server.rdb
      .getAddressTransactionPages(msg.address, msg.hash, msg.number)
      .then((result: any): void => cb(null, result))
      .catch((error: Error): void => cb(error, null))
  }
}

export default getAddressTxPagesEvent
