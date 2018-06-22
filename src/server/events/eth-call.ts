import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const ethCallEvent: SocketEvent = {
  name: 'ethCall',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.vmRunner.call(msg, cb)
  }
}

export default ethCallEvent
