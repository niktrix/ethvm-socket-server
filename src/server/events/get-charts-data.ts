import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getChartsDataEvent: SocketEvent = {
  name: 'getChartsData',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb
      .getChartsData()
      .then((result: any): void => cb(null, result))
      .catch((error: Error): void => cb(error, null))
  }
}

export default getChartsDataEvent
