import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTokenBalanceEvent: SocketEvent = {
  name: 'getTokenBalance',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.vmEngine
      .getAllTokens(msg)
      .then((result: any): void => cb(null, result))
      .catch((error: Error): void => cb(error, null))
  }
}

export default getTokenBalanceEvent
