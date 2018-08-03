import { AddressValidator, errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { AddressPayload } from '@app/models'
import { EthVMServer, SocketEvent } from '@app/server'

const getBalanceEvent: SocketEvent = {
  name: 'getBalance',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    const isValid = AddressValidator(msg)
    if (!isValid) {
      logger.error(`event -> getBalance / Invalid payload: ${msg}`)
      cb(AddressValidator.errors, null)
      return
    }

    server.vmEngine
      .getBalance(msg)
      .then(result => cb(null, result))
      .catch(error => {
        logger.error(`event -> getBalance / Error: ${error}`)
        cb(errors.serverError, null)
      })
  }
}

export default getBalanceEvent
