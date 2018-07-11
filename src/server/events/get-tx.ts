import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTxEvent: SocketEvent = {
  name: 'getTx',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb
      .getTx(msg)
      .then((result: any): void => cb(null, result))
      .catch((error: Error) => cb(error, null))
  }
}

export default getTxEvent
