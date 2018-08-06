import { Tx } from '@app/models'

export interface TxsService {
  getTx(hash: string): Promise<Tx[]>
  getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]>
  getAddressTxPages(address: Buffer, hash: Buffer, bNumber: number): Promise<Tx[]>
  getTotalTxs(hash: string): Promise<number>
  getTxsOfAddress(hash: string): Promise<Tx[]>
}

export class TxsServiceImpl implements TxsService {
  public getTx(hash: string): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }

  public getTxsPages(bNumber: number, hash?: Buffer | undefined): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }

  public getAddressTxPages(address: Buffer, hash: Buffer, bNumber: number): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }

  public getTotalTxs(hash: string): Promise<number> {
    throw new Error('Method not implemented.')
  }

  public getTxsOfAddress(hash: string): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }
}
