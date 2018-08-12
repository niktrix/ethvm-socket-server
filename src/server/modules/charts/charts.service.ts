import { BlockchainDataStore } from '@app/server/datastores'

export interface ChartService {
  getBlockSize(startDate: Date, endDate: Date, groupBy?: string): Promise<number>
  getAccountsGrowth(startDate: Date, endDate: Date): Promise<any>
  getAvTxFee(startDate: Date, endDate: Date): Promise<any>
  getGasLimit(startDate: Date, endDate: Date): Promise<number>
}

export class ChartsServiceImpl implements ChartService {
  constructor(private readonly ds: BlockchainDataStore) {}

  public getBlockSize(startDate: Date, endDate: Date, groupBy?: string): Promise<number> {
    return this.ds.getChartBlockSize(startDate, endDate, groupBy)
  }

  public getAccountsGrowth(startDate: Date, endDate: Date): Promise<any> {
    return this.ds.getChartAccountsGrowth(startDate, endDate)
  }

  public getAvTxFee(startDate: Date, endDate: Date): Promise<any> {
    return this.ds.getChartAvTxFee(startDate, endDate)
  }

  public getGasLimit(startDate: Date, endDate: Date): Promise<number> {
    return this.ds.getChartGasLimit(startDate, endDate)
  }
}
