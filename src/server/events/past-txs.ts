import { logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { Tx } from '@app/models'
import { EthVMServer, SocketEvent } from '@app/server'

const pastTxsEvent: SocketEvent = {
  name: 'pastTxs',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.ds
      .getTransactions()
      .then(
        (txs: Tx[]): void => {
          const _txs: Tx[] = []

          txs.forEach((t: Tx) => {
            _txs.unshift(t)
          })

          cb(null, _txs)
        }
      )
      .catch((error: Error): void => {
        logger.error(`pastTxs / Error: ${error}`)
      })
  }
}

export default pastTxsEvent
