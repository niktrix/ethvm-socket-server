import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import _ from 'lodash'

// TODO: Create helper function convert selected enum string to time duration
const getChartsDataEvent: SocketEvent = {
  name: 'getChartAccountsGrowth',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = _.isObject(payload) && validators.chartPayloadValidator(payload)
    if (!isValid) {
      cb(validators.chartPayloadValidator.errors, null)
      return
    }

    server.rdb
      .getChartAccountsGrowth(new Date(), new Date())
      .then((result: any): void => cb(null, result))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getChartAccountsGrowth / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getChartsDataEvent
