import { DurationValidator } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

// TODO: Create helper function convert selected enum string to time duration
const getChartsDataEvent: SocketEvent = {
  name: 'getChartAccountsGrowth',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    const isValid = DurationValidator(msg)
    if (!isValid) {
      cb(DurationValidator.errors, null)
      return
    }

    server.rdb
      .getChartAccountsGrowth(new Date(), new Date())
      .then((result: any): void => cb(null, result))
      .catch((error: Error): void => cb(error, null))
  }
}

export default getChartsDataEvent
