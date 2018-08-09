import { blockTxsPayloadValidator } from '@app/helpers'
import { Block, BlocksTxsPayload } from '@app/models'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

const getBlockTxsEvent: SocketEvent = {
  id: 'getBlockTransactions', // new_name: block_txs

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = blockTxsPayloadValidator(payload) as boolean

    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: BlocksTxsPayload): Promise<Block> => server.rdb.getBlockTxs(payload.hash)
}

export default getBlockTxsEvent
