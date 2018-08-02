export interface BlockchainDataStore {
  initialize(): Promise<boolean>

  getAddressTransactionPages(address: Buffer, hash: Buffer, bNumber: number): Promise<any>

  getTransactionPages(hash: Buffer, bNumber: number): Promise<any>

  getBlockTransactions(hash: string): Promise<any>

  getTotalTxs(hash: string): Promise<any>

  getTxsOfAddress(hash: string): Promise<any>

  getChartBlockSize(startDate: Date, endDate: Date, groupBy?: string): Promise<any>

  getChartAccountsGrowth(startDate: Date, endDate: Date): Promise<any>

  getChartAvTxFee(startDate: Date, endDate: Date): Promise<any>

  getChartGasLimit(startDate: Date, endDate: Date): Promise<any>

  getBlock(hash: string): Promise<any>

  getTx(hash: string): Promise<any>
}
