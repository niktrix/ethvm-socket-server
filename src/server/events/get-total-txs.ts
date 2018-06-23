import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTotalTxsEvent: SocketEvent = {
  name: 'getTotalTxs',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb
      .getTotalTxs(msg)
      .then(count => cb(null, count))
      .catch(error => cb(error, null))
  }
}

export default getTotalTxsEvent
