import { BlockchainDataStore } from '@app/server/datastores'
import { Tx } from '@app/server/modules/txs'

export interface TxsService {
  getTx(hash: string): Promise<Tx>
  getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]>
  getAddressTxPages(address: Buffer, bNumber: number, hash?: Buffer): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>
  getTotalTxs(hash: string): Promise<number>
}

export class TxsServiceImpl implements TxsService {

  constructor(private readonly ds: BlockchainDataStore) {
  }

  public getTx(hash: string): Promise<Tx> {
    return this.ds.getTx(hash)
  }

  public getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]> {
    return this.getTxsPages(bNumber, hash)
  }

  public getAddressTxPages(address: Buffer, bNumber: number, hash?: Buffer): Promise<Tx[]> {
    return this.getAddressTxPages(address, bNumber, hash)
  }

  public getTotalTxs(hash: string): Promise<number> {
    return this.getTotalTxs(hash)
  }

  public getTxsOfAddress(hash: string): Promise<Tx[]> {
    return this.getTxsOfAddress(hash)
  }
}
