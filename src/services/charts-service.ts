export interface ChartService {
  getBlockSize(from: Date, to: Date, groupBy?: string): Promise<number>
  getAccountsGrowth(from: Date, to: Date): Promise<any>
  getAverageTxFee(from: Date, to: Date): Promise<any>
  getGasLimit(from: Date, to: Date): Promise<number>
}

export class ChartsServiceImpl implements ChartService {
  public getBlockSize(from: Date, to: Date, groupBy?: string | undefined): Promise<number> {
    throw new Error('Method not implemented.')
  }

  public getAccountsGrowth(from: Date, to: Date): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public getAverageTxFee(from: Date, to: Date): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public getGasLimit(from: Date, to: Date): Promise<number> {
    throw new Error('Method not implemented.')
  }
}
