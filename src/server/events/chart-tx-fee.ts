import { chartPayloadValidator, toDatePeriods } from '@app/helpers'
import { ChartPayload } from '@app/models'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

const getChartsAvTxFeeDataEvent: SocketEvent = {
  id: 'getChartAvTxFee', // new_name: chart_tx_Fee

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = chartPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: ChartPayload): Promise<any> => {
    const period = toDatePeriods(payload.duration)
    return server.rdb.getChartAvTxFee(period.from, period.to)
  }
}

export default getChartsAvTxFeeDataEvent
