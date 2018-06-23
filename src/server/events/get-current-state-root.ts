import { errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getCurrentStateRootEvent: SocketEvent = {
  name: 'getCurrentStateRoot',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (msg !== '') {
      cb(errors.invalidInput, null)
      return
    }

    server.vmRunner
      .getCurrentStateRoot()
      .then(result => {
        cb(null, result)
      })
      .catch((error: Error) => {
        logger.error(`getCurrentStateRoot / Error: ${error}`)
      })
  }
}

export default getCurrentStateRootEvent
