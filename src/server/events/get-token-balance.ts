import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import _ from 'lodash'

const getTokenBalanceEvent: SocketEvent = {
  name: 'getTokenBalance',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = _.isObject(payload) && validators.tokensValidator(payload)
    if (!isValid) {
      logger.error(`event -> getTokenBalance / Invalid payload: ${payload}`)
      cb(validators.tokensValidator.errors, null)
      return
    }

    server.vmEngine
      .getAllTokens(payload)
      .then((result: any): void => cb(null, result))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getTokenBalance / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getTokenBalanceEvent
