export interface BlockchainDataStore {
  initialize(): Promise<boolean>

  getAddressTransactionPages(address: Buffer, hash: Buffer, bNumber: number): Promise<any>

  getTransactionPages(hash: Buffer, bNumber: number): Promise<any>

  getBlockTransactions(hash: string): Promise<any>

  getTotalTxs(hash: string): Promise<any>

  getTxsOfAddress(hash: string): Promise<any>

  getChartsData(): Promise<any>

  getBlock(hash: string): Promise<any>

  getTx(hash: string): Promise<any>
}
