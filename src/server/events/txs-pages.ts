import { txsPagesPayloadValidator } from '@app/helpers'
import { Tx, TxsPagesPayload } from '@app/models'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

const getTxPagesEvent: SocketEvent = {
  id: 'getTransactionPages', // new_name: txs_pages

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = txsPagesPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: TxsPagesPayload): Promise<Tx[]> => server.rdb.getTxsPages(payload.number, payload.hash)
}

export default getTxPagesEvent
