import { errors, eth, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTxEvent: SocketEvent = {
  name: 'getTx',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.rdb
      .getTx(msg)
      .then((result: any): void => cb(null, result))
      .catch((error: Error) => {
        logger.error(`event -> getTx / Error: ${error}`)
        cb(errors.serverError, null)
      })
  }
}

export default getTxEvent
