import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
// import fetch from 'node-fetch'

// async function getEthToUSD(cb: (error: Error, data: any) => void) {
//   const res = await fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/')
//   const json = await res.json()
//   return cb(null, json)
// }

const getExchangeRatesEvent: SocketEvent = {
  name: 'getEthToUSD',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    // glob.cacheDB.getString(
    //   new Buffer('Iethtousd'),
    //   {
    //     keyEncoding: 'binary',
    //     valueEncoding: 'binary'
    //   },
    //   (err: Error, result: any) => {
    //     if (err == null) {
    //       l.debug('EthtoUSD is in cache get')
    //       cb(err, result)
    //     } else {
    //       l.debug('EthtoUSD getting from api')
    //       getEthToUSD((er, data) => {
    //         l.debug('data', data[0].price_usd)
    //         glob.cacheDB.put(
    //           new Buffer('Iethtousd'),
    //           new Buffer(data[0].price_usd),
    //           {
    //             keyEncoding: 'binary',
    //             valueEncoding: 'binary'
    //           },
    //           (e: Error, res: any) => {
    //             cb(e, res)
    //           }
    //         )
    //         cb(er, result)
    //       })
    //     }
    //   }
    // )
  }
}

export default getExchangeRatesEvent
