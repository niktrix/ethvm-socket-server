import { errors, logger, TokensValidator } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTokenBalanceEvent: SocketEvent = {
  name: 'getTokenBalance',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    const isValid = TokensValidator(msg)
    if (!isValid) {
      logger.error(`event -> getTokenBalance / Invalid payload: ${msg}`)
      cb(TokensValidator.errors, null)
      return
    }

    const payload = JSON.parse(msg)

    server.vmEngine
      .getAllTokens(msg)
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
