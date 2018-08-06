import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import _ from 'lodash'

// TODO: Create helper function to request time
const getChartsDataEvent: SocketEvent = {
  name: 'getChartGasLimit',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = _.isObject(payload) && validators.chartPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getChartGasLimit / Invalid payload: ${payload}`)
      cb(validators.chartPayloadValidator.errors, null)
      return
    }

    server.rdb
      .getChartGasLimit(new Date(), new Date())
      .then((result: any): void => cb(null, result))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getChartGasLimit / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getChartsDataEvent
