import { Block, Tx } from '@app/models'

export interface BlockchainDataStore {
  initialize(): Promise<boolean>

  getBlock(hash: string): Promise<Block>
  getBlockTxs(hash: string): Promise<Block>

  getTx(hash: string): Promise<Tx[]>
  getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]>
  getAddressTxPages(address: Buffer, bNumber: number, hash?: Buffer): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>
  getTotalTxs(hash: string): Promise<number>

  getChartBlockSize(startDate: Date, endDate: Date, groupBy?: string): Promise<number>
  getChartAccountsGrowth(startDate: Date, endDate: Date): Promise<any>
  getChartAvTxFee(startDate: Date, endDate: Date): Promise<any>
  getChartGasLimit(startDate: Date, endDate: Date): Promise<number>
}
