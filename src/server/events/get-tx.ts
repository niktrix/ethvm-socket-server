import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTxEvent: SocketEvent = {
  name: 'getTx',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb.getTx(msg, cb)
  }
}

export default getTxEvent
