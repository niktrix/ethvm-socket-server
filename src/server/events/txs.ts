import { txsPayloadValidator } from '@app/helpers'
import { Tx, TxsPayload } from '@app/models'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

const getTxsEvent: SocketEvent = {
  id: 'getTxs', // new_name: address_txs

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = txsPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: TxsPayload): Promise<Tx[]> =>
    server.rdb.getTxsOfAddress(payload.address, payload.limit, payload.page)
}

export default getTxsEvent
