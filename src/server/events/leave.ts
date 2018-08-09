import { joinLeavePayloadValidator, logger } from '@app/helpers'
import { JoinLeavePayload } from '@app/models/payloads/JoinLeavePayload'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

const leaveEvent: SocketEvent = {
  id: 'leave',

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = joinLeavePayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: JoinLeavePayload): Promise<any> => {
    payload.rooms.forEach(room => {
      logger.debug(`event -> leave / Leaving room: ${payload}`)
      socket.join(room)
    })
    return Promise.resolve(undefined)
  }
}

export default leaveEvent
