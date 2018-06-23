import { errors, eth } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getKeyValueEvent: SocketEvent = {
  name: 'getKeyValue',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (!eth.isBufferObject(msg, 32)) {
      cb(errors.notBuffer, null)
      return
    }

    // server.cacheDB.get(
    //   new Buffer(msg),
    //   {
    //     keyEncoding: 'binary',
    //     valueEncoding: 'binary'
    //   },
    //   cb
    // )
  }
}

export default getKeyValueEvent
