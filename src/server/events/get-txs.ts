import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import _ from 'lodash'

const getTxsEvent: SocketEvent = {
  name: 'getTxs',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = _.isObject(payload) && validators.txsPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getTxs / Invalid payload: ${payload}`)
      cb(validators.txsPayloadValidator.errors, null)
      return
    }

    server.rdb
      .getTxsOfAddress(payload)
      .then(result => cb(null, result))
      .catch(error => {
        logger.error(`event -> getTxs / Error: ${error}`)
        cb(errors.serverError, null)
      })
  }
}

export default getTxsEvent
