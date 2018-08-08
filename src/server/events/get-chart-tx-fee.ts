import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { toDatePeriods } from '@app/models/helpers'
import { EthVMServer, SocketEvent } from '@app/server'

const getChartsAvTxFeeDataEvent: SocketEvent = {
  name: 'getChartAvTxFee', // new_name: chart_tx_Fee
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = validators.chartPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getChartAvTxFee / Invalid payload: ${payload}`)
      cb(validators.chartPayloadValidator.errors, null)
      return
    }

    const period = toDatePeriods(payload.duration)
    server.rdb
      .getChartAvTxFee(period.from, period.to)
      .then((result: any): void => cb(null, result))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getChartAvTxFee / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getChartsAvTxFeeDataEvent
