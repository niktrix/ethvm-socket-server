import { Log } from '@app/models'

export class TxLog {
  public hash: Buffer = new Buffer(0)
  public logs: Log[] = []
}
