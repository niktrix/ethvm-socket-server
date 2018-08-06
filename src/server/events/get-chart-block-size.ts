import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { AddressPayload } from '@app/models'
import { EthVMServer, SocketEvent } from '@app/server'
import _ from 'lodash'

// TODO: Create helper function to request time
const getChartsDataEvent: SocketEvent = {
  name: 'getChartBlockSize',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = _.isObject(payload) && validators.chartPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getChartBlockSize / Invalid payload: ${payload}`)
      cb(validators.chartPayloadValidator.errors, null)
      return
    }

    server.rdb
      .getChartBlockSize(new Date(), new Date())
      .then((result: any): void => cb(null, result))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getChartBlockSize / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getChartsDataEvent
