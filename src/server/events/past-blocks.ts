import { logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { Block } from '@app/models'
import { EthVMServer, SocketEvent } from '@app/server'

const pastBlocksEvent: SocketEvent = {
  name: 'pastBlocks',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    server.ds
      .getBlocks()
      .then(
        (blocks: Block[]): void => {
          const _blocks: Block[] = []

          blocks.forEach(
            (block: Block, idx: number): void => {
              blocks.unshift(block)
            }
          )

          cb(null, _blocks)
        }
      )
      .catch(
        (error: Error): void => {
          logger.error(`pastBlockEvents / Error: ${error}`)
        }
      )
  }
}

export default pastBlocksEvent
