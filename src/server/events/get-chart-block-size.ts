import { DurationValidator, errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

// TODO: Validate input with AJV
// TODO: Create helper function to request time
const getChartsDataEvent: SocketEvent = {
  name: 'getChartBlockSize',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    const isValid = DurationValidator(msg)
    if (!isValid) {
      logger.error(`event -> getBlockTransactions / Invalid payload: ${msg}`)
      cb(DurationValidator.errors, null)
      return
    }

    server.rdb
      .getChartBlockSize(new Date(), new Date())
      .then((result: any): void => cb(null, result))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getChartBlockSize / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getChartsDataEvent
