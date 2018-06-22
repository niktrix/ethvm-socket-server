import { Callback } from '@app/interfaces'
import { common } from '@app/libs'
import { EthVMServer, SocketEvent } from '@app/server'

const getKeyValueEvent: SocketEvent = {
  name: 'getKeyValue',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    if (!common.check.isBufferObject(msg, 32)) {
      cb(common.newError(common.errors.notBuffer), null)
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
