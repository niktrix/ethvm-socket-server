import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import fetch from 'node-fetch'

const getExchangeRatesEvent: SocketEvent = {
  name: 'getEthToUSD',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/').then(res => cb(null, res.json())).catch(error => cb(error, null))
  }
}

export default getExchangeRatesEvent
