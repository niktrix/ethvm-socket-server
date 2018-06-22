import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getBlockTxsEvent: SocketEvent = {
  name: 'getBlockTransactions',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb.getBlockTransactions(msg, cb)
  }
}

export default getBlockTxsEvent
