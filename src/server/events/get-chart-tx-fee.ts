import { logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

// TODO: Validate input with AJV
// TODO: Create helper function to request time
const getChartsAvTxFeeDataEvent: SocketEvent = {
  name: 'getChartAvTxFee',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb
      .getChartAvTxFee(new Date(), new Date())
      .then((result: any): void => cb(null, result))
      .catch((error: Error): void => cb(error, null))
  }
}

export default getChartsAvTxFeeDataEvent
