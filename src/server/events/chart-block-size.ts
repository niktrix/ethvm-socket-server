import { chartPayloadValidator } from '@app/helpers'
import { ChartPayload } from '@app/models'
import { toDatePeriods } from '@app/models/helpers'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server'

// TODO: Create helper function to request time
const getChartsDataEvent: SocketEvent = {
  id: 'getChartBlockSize', // new_name: chart_block_size

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = chartPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: ChartPayload): Promise<any> => {
    const period = toDatePeriods(payload.duration)
    return server.rdb.getChartBlockSize(period.from, period.to)
  }
}

export default getChartsDataEvent
