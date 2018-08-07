import { errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTxsEvent: SocketEvent = {
  name: 'getTxs',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb
      .getTxsOfAddress(msg.address, msg.limit, msg.page)
      .then(result => cb(null, result))
      .catch(error => {
        logger.error(`event -> getTxs / Error: ${error}`)
        cb(errors.serverError, null)
      })
  }
}

export default getTxsEvent
