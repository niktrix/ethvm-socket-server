import { logger } from '@app/server/core/logger'
import { joinLeavePayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { JoinLeavePayload } from '@app/server/payloads'

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
    payload.rooms.forEach(room => {
      logger.debug(`event -> join / Joining room: ${payload}`)
      socket.join(room)
    })
    return Promise.resolve(undefined)
  }
}

export default joinEvent
