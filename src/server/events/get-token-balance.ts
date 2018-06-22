import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTokenBalanceEvent: SocketEvent = {
  name: 'getTokenBalance',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.vmEngine
      .getAllTokens(msg)
      .then(result => cb(null, result))
      .catch(error => cb(error, null))
  }
}

export default getTokenBalanceEvent
