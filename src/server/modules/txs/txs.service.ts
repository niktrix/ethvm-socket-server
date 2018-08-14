import { Tx, TxsRepository } from '@app/server/modules/txs'
import { CacheRepository } from '@app/server/repositories'

export interface TxsService {
  getTxs(): Promise<Tx[]>
  getTx(hash: string): Promise<Tx | null>
  getBlockTxs(hash: Buffer): Promise<Tx[]>
  getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]>
  getAddressTxPages(address: Buffer, bNumber: number, hash?: Buffer): Promise<Tx[]>
  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]>
  getTotalTxs(hash: string): Promise<number>
}

export class TxsServiceImpl implements TxsService {
  constructor(private readonly txsRepository: TxsRepository, private readonly cacheRepository: CacheRepository) {}

  public getTxs(): Promise<Tx[]> {
    return this.cacheRepository.getTransactions()
  }

  public getTx(hash: string): Promise<Tx | null> {
    return this.txsRepository.getTx(hash)
  }

  public getBlockTxs(hash: Buffer): Promise<Tx[]> {
    return this.txsRepository.getBlockTxs(hash)
  }

  public getTxsPages(bNumber: number, hash?: Buffer): Promise<Tx[]> {
    return this.txsRepository.getTxsPages(bNumber, hash)
  }

  public getAddressTxPages(address: Buffer, bNumber: number, hash?: Buffer): Promise<Tx[]> {
    return this.txsRepository.getAddressTxPages(address, bNumber, hash)
  }

  public getTotalTxs(hash: string): Promise<number> {
    return this.txsRepository.getTotalTxs(hash)
  }

  public getTxsOfAddress(hash: string, limit: number = 10, page: number = 0): Promise<Tx[]> {
    return this.txsRepository.getTxsOfAddress(hash, limit, page)
  }
}
