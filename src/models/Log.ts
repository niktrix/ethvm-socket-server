export class Log {
  public address: Buffer = new Buffer(0)
  public topics: Buffer[] = []
  public data: Buffer = new Buffer(0)
  public blockNumber: Buffer = new Buffer(0)
  public txHash: Buffer = new Buffer(0)
  public txIndex: Buffer = new Buffer(0)
  public blockHash: Buffer = new Buffer(0)
  public index: Buffer = new Buffer(0)
  public removed: boolean = false
}
