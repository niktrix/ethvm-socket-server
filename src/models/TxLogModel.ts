import { LogModel } from '@/models'

export interface TxLogModel {
  hash: Buffer
  logs: Array<LogModel>
}
