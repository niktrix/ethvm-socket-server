import { Block, Tx } from '@app/models'

export interface BlockchainDataStore {
  initialize(): Promise<boolean>

  getBlock(hash: string): Promise<Block>
  getBlockTxs(hash: string): Promise<Block>

  getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]>
  getAddressTxPages(address: Buffer, hash: Buffer, bNumber: number): Promise<Tx[]>
  getTotalTxs(hash: string): Promise<number>
  getTxsOfAddress(hash: string): Promise<Tx[]>
  getTx(hash: string): Promise<Tx[]>

  getChartBlockSize(startDate: Date, endDate: Date, groupBy?: string): Promise<number>
  getChartAccountsGrowth(startDate: Date, endDate: Date): Promise<any>
  getChartAvTxFee(startDate: Date, endDate: Date): Promise<any>
  getChartGasLimit(startDate: Date, endDate: Date): Promise<number>
}
