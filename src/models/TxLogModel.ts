import { LogModel } from '@app/models'

export interface TxLogModel {
  hash: Buffer
  logs: LogModel[]
}
