import { toDatePeriods } from '@app/server/core/utils'
import { chartPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { ChartPayload } from '@app/server/payloads'

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
