import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getBlockTxsEvent: SocketEvent = {
  name: 'getBlockTransactions',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb
      .getBlockTransactions(msg)
      .then((result: any): void => cb(null, result))
      .catch((error: Error) => cb(error, null))
  }
}

export default getBlockTxsEvent
