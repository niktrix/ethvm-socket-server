import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getBalanceEvent: SocketEvent = {
  name: 'getBalance',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.vmEngine
      .getBalance(msg)
      .then(result => cb(null, result))
      .catch(error => cb(error, null))
  }
}

export default getBalanceEvent
