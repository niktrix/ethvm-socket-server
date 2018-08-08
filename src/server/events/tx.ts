import { txPayloadValidator } from '@app/helpers'
import { Tx, TxPayload } from '@app/models'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

const getTxEvent: SocketEvent = {
  id: 'getTx', // new_name: tx

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = txPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: TxPayload): Promise<Tx> => server.rdb.getTx(payload.hash)
}

export default getTxEvent
