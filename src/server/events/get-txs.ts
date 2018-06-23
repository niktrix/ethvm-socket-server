import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTxsEvent: SocketEvent = {
  name: 'getTxs',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb
      .getTxsOfAddress(msg)
      .then(result => cb(null, result))
      .catch(error => cb(error, null))
  }
}

export default getTxsEvent
