import { ethCallPayloadValidator } from '@app/helpers';
import { EthCallPayload } from '@app/models';
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server';

const ethCallEvent: SocketEvent = {
  id: 'ethCall', // new_id: eth_call

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = ethCallPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  // TODO: Restore proper behavior
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: EthCallPayload): Promise<boolean> => {
    // server.vmRunner.call(payload.to, payload.data, cb)
    return Promise.resolve(true)
  }
}

export default ethCallEvent
