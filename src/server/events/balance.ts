import { balancePayloadValidator } from '@app/helpers'
import { BalancePayload } from '@app/models'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

const getBalanceEvent: SocketEvent = {
  id: 'getBalance', // new_name: balance

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = balancePayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: BalancePayload): Promise<any> => server.vmEngine.getBalance(payload.address)
}

export default getBalanceEvent
