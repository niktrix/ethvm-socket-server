import { Log } from '@app/models'

export interface TxLog {
  hash: Buffer
  logs: Log[]
}
