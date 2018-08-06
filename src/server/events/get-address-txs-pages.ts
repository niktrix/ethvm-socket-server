import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { Tx } from '@app/models'
import { EthVMServer, SocketEvent } from '@app/server'
import _ from 'lodash'

const getAddressTxPagesEvent: SocketEvent = {
  name: 'getAddressTransactionPages',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = _.isObject(payload) && validators.addressTxsPagesPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getAddressTransactionPages / Invalid payload: ${payload}`)
      cb(validators.addressTxsPagesPayloadValidator.errors, null)
      return
    }

    server.rdb
      .getAddressTxPages(payload.address, payload.number, payload.hash)
      .then((result: Tx[]): void => cb(null, result))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getAddressTransactionPages / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getAddressTxPagesEvent
