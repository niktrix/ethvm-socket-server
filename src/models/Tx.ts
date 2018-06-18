export class Tx {
  public root?: Buffer
  public blockHash: Buffer
  public blockNumber?: Buffer
  public transactionIndex?: Buffer
  public from: Buffer
  public fromBalance?: Buffer
  public to: Buffer
  public toBalance?: Buffer
  public gasUsed: Buffer
  public cumulativeGasUsed?: Buffer
  public contractAddress: Buffer
  public logsBloom?: Buffer
  public gas: Buffer
  public gasPrice: Buffer
  public hash: Buffer
  public input: Buffer
  public nonce?: Buffer
  public value: Buffer
  public v?: Buffer
  public r?: Buffer
  public s?: Buffer
  public status: boolean
  public pending?: boolean
  public timestamp: Buffer
}
