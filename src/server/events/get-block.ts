import { AddressValidator, errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import { AddressPayload } from 'models';

const getBlockEvent: SocketEvent = {
  name: 'getBlock',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    const isValid = AddressValidator(msg)
    if (!isValid) {
      logger.error(`event -> getBlockTransactions / Invalid payload: ${msg}`)
      cb(AddressValidator.errors, null)
      return
    }

    const payload: AddressPayload = JSON.parse(msg)

    server.rdb
      .getBlock(payload.address)
      .then((result: any): void => cb(null, result))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getBlock / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getBlockEvent
