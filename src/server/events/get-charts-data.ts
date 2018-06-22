import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getChartsDataEvent: SocketEvent = {
  name: 'getChartsData',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb.getChartsData(cb)
  }
}

export default getChartsDataEvent
