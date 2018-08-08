import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getBalanceEvent: SocketEvent = {
  name: 'getBalance', // new_name: balance
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = validators.balancePayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getBalance / Invalid payload: ${payload}`)
      cb(validators.balancePayloadValidator.errors, null)
      return
    }

    server.vmEngine
      .getBalance(payload.address)
      .then(result => cb(null, result))
      .catch(error => {
        logger.error(`event -> getBalance / Error: ${error}`)
        cb(errors.serverError, null)
      })
  }
}

export default getBalanceEvent
