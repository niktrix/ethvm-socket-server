import { errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTotalTxsEvent: SocketEvent = {
  name: 'getTotalTxs',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb
      .getTotalTxs(msg)
      .then((count: any): void => cb(null, count))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getTotalTxs / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getTotalTxsEvent
