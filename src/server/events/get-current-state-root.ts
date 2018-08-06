import { errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getCurrentStateRootEvent: SocketEvent = {
  name: 'getCurrentStateRoot',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    server.vmRunner
      .getCurrentStateRoot()
      .then((result: any): void => cb(null, result))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getCurrentStateRoot / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getCurrentStateRootEvent
