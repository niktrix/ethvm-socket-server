import { errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { Tx } from '@app/models'
import { EthVMServer, SocketEvent } from '@app/server'

const pastTxsEvent: SocketEvent = {
  name: 'pastTxs',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    server.ds
      .getTransactions()
      .then(
        (_txs: Tx[]): void => {
          const txs: Tx[] = []
          _txs.forEach((t: Tx) => {
            txs.unshift(t)
          })

          cb(null, txs)
        }
      )
      .catch(
        (error: Error): void => {
          logger.error(`event -> pastTxs / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default pastTxsEvent
