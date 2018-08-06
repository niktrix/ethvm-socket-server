import { errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { Block } from '@app/models'
import { EthVMServer, SocketEvent } from '@app/server'

const pastBlocksEvent: SocketEvent = {
  name: 'pastBlocks',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    server.ds
      .getBlocks()
      .then(
        (_blocks: Block[]): void => {
          const blocks: Block[] = []
          _blocks.forEach(
            (block: Block): void => {
              blocks.unshift(block)
            }
          )

          cb(null, blocks)
        }
      )
      .catch(
        (error: Error): void => {
          logger.error(`event -> pastBlockEvents / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default pastBlocksEvent
