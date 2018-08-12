import { addressTxsPagesPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Tx } from '@app/server/modules/txs'
import { AddressTxsPagesPayload } from '@app/server/payloads'

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
    server.txsService.getAddressTxPages(payload.address, payload.number, payload.hash)
}

export default getAddressTxPagesEvent
