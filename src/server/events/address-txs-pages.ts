import { addressTxsPagesPayloadValidator } from '@app/helpers'
import { AddressTxsPagesPayload, Tx } from '@app/models'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

const getAddressTxPagesEvent: SocketEvent = {
  id: 'getAddressTransactionPages', // new_name: address_txs_pages

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = addressTxsPagesPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: AddressTxsPagesPayload): Promise<Tx[]> =>
    server.rdb.getAddressTxPages(payload.address, payload.number, payload.hash)
}

export default getAddressTxPagesEvent
