import { chartPayloadValidator } from '@app/helpers'
import { ChartPayload } from '@app/models'
import { toDatePeriods } from '@app/models/helpers'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

const getChartsDataEvent: SocketEvent = {
  id: 'getChartAccountsGrowth', // new_name: chart_accounts_growth

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = chartPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: ChartPayload): Promise<any> => {
    const period = toDatePeriods(payload.duration)
    return server.rdb.getChartAccountsGrowth(period.from, period.to)
  }
}

export default getChartsDataEvent
