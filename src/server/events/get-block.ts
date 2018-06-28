import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getBlockEvent: SocketEvent = {
  name: 'getBlock',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb
      .getBlock(msg)
      .then((result: any): void => cb(null, result))
      .catch((error: Error): void => cb(error, null))
  }
}

export default getBlockEvent
