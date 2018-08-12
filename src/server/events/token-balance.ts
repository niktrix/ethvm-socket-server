import { tokensBalancePayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { TokensBalancePayload } from '@app/server/payloads'

const getTokenBalanceEvent: SocketEvent = {
  id: 'getTokenBalance', // new_name: tokens_balance

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = tokensBalancePayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: TokensBalancePayload): Promise<any> => server.vmService.getTokensBalance(payload.address)
}

export default getTokenBalanceEvent
