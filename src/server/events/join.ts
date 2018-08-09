import { joinLeavePayloadValidator, logger } from '@app/helpers'
import { JoinLeavePayload } from '@app/models/payloads/JoinLeavePayload'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

const joinEvent: SocketEvent = {
  id: 'join',

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = joinLeavePayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: JoinLeavePayload): Promise<any> => {
    logger.debug(`event -> join / Joining room: ${payload}`)
    socket.join(payload)
    return Promise.resolve(undefined)
  }
}

export default joinEvent
