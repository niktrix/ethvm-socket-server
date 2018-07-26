import { AddressValidator } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'


const getBlockTxsEvent: SocketEvent = {
  name: 'getBlockTransactions',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    const isValid = AddressValidator(msg);
    if (!isValid) {
      cb(AddressValidator.errors, null)
    }
    server.rdb
      .getBlockTransactions(msg)
      .then((result: any): void => cb(null, result))
      .catch((error: Error) => cb(error, null))
  }
}

export default getBlockTxsEvent
