import { joinLeavePayloadValidator, logger } from '@app/helpers'
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

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<any> => {
    logger.debug(`event -> leave / Leaving room: ${payload}`)
    socket.leave(payload)
    return Promise.resolve(undefined)
  }
}

export default leaveEvent
