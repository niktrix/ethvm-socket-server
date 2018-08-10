import { Tx } from '@app/server/modules/txs'

export interface TxsService {
  getTx(hash: string): Promise<Tx>
  getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]>
  getAddressTxPages(address: Buffer, bNumber: number, hash?: Buffer): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>
  getTotalTxs(hash: string): Promise<number>
}

export class TxsServiceImpl implements TxsService {
  getTx(hash: string): Promise<Tx> {
    throw new Error('Method not implemented.')
  }

  public getTxsPages(bNumber: number, hash?: Buffer | undefined): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }

  getAddressTxPages(address: Buffer, bNumber: number, hash?: Buffer | undefined): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }

  public getTotalTxs(hash: string): Promise<number> {
    throw new Error('Method not implemented.')
  }

  public getTxsOfAddress(hash: string): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }
}
