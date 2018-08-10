export interface ChartService {
  getBlockSize(startDate: Date, endDate: Date, groupBy?: string): Promise<number>
  getAccountsGrowth(startDate: Date, endDate: Date): Promise<any>
  getAvTxFee(startDate: Date, endDate: Date): Promise<any>
  getGasLimit(startDate: Date, endDate: Date): Promise<number>
}

export class ChartsServiceImpl implements ChartService {

  getBlockSize(startDate: Date, endDate: Date, groupBy?: string): Promise<number> {
    throw new Error('Method not implemented.')
  }

  getAccountsGrowth(startDate: Date, endDate: Date): Promise<any> {
    throw new Error('Method not implemented.')
  }

  getAvTxFee(startDate: Date, endDate: Date): Promise<any> {
    throw new Error('Method not implemented.')
  }

  getGasLimit(startDate: Date, endDate: Date): Promise<number> {
    throw new Error('Method not implemented.')
  }
}
