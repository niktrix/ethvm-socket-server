export class Tx {
  public root?: Buffer
  public blockHash: Buffer = new Buffer(0)
  public blockNumber?: Buffer
  public transactionIndex?: Buffer
  public from: Buffer = new Buffer(0)
  public fromBalance?: Buffer
  public to: Buffer = new Buffer(0)
  public toBalance?: Buffer
  public gasUsed: Buffer = new Buffer(0)
  public cumulativeGasUsed?: Buffer
  public contractAddress: Buffer = new Buffer(0)
  public logsBloom?: Buffer
  public gas: Buffer = new Buffer(0)
  public gasPrice: Buffer = new Buffer(0)
  public hash: Buffer = new Buffer(0)
  public input: Buffer = new Buffer(0)
  public nonce?: Buffer
  public value: Buffer = new Buffer(0)
  public v?: Buffer
  public r?: Buffer
  public s?: Buffer
  public status: boolean = false
  public pending?: boolean
  public timestamp: Buffer = new Buffer(0)
}
