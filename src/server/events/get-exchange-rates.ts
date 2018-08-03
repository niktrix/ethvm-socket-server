import { errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import fetch from 'node-fetch'

// TODO: Refactor this code to use Cryptocompare API (and store information inside a short lived cache)
// API URL: https://www.cryptocompare.com/api/data/coinlist/
// API Doc: https://www.cryptocompare.com/api/#-api-data-coinlist
const getExchangeRatesEvent: SocketEvent = {
  name: 'getTokenToUSD',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    fetch('http://still-waters-52916.herokuapp.com/ticker')
      .then(res => cb(null, res.json()))
      .catch(error => {
        logger.error(`event -> getTokenToUSD / Error: ${error}`)
        cb(errors.serverError, null)
      })
  }
}

export default getExchangeRatesEvent
