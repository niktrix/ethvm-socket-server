import { logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { common } from '@app/libs'
import { EthVMServer, SocketEvent } from '@app/server'

const getCurrentStateRootEvent: SocketEvent = {
  name: 'getCurrentStateRoot',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (msg !== '') {
      cb(common.newError(common.errors.invalidInput), null)
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
