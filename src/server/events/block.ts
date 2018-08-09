import { blockPayloadValidator } from '@app/helpers'
import { Block } from '@app/models'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

const getBlockEvent: SocketEvent = {
  id: 'getBlock', // new_name: block

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = blockPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Block> => server.rdb.getBlock(payload.hash)
}

export default getBlockEvent
