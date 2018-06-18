import { Log } from '@app/models'

export class TxLog {
  public hash: Buffer
  public logs: Log[]
}
