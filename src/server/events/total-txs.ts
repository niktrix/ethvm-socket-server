import { totalTxsPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { TotalTxsPayload } from '@app/server/payloads'

const getTotalTxsEvent: SocketEvent = {
  id: 'getTotalTxs', // new_name: total_txs

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = totalTxsPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: TotalTxsPayload): Promise<number> => server.rdb.getTotalTxs(payload.address)
}

export default getTotalTxsEvent
