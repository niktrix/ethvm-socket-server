export class Transfer {
  public op: string = ''
  public value: Buffer = new Buffer(0)
  public from: Buffer = new Buffer(0)
  public fromBalance: Buffer = new Buffer(0)
  public to: Buffer = new Buffer(0)
  public toBalance: Buffer = new Buffer(0)
  public input: Buffer = new Buffer(0)
}
