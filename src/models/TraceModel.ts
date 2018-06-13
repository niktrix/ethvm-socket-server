interface TransferModel {
  op: string
  value: Buffer
  from: Buffer
  fromBalance: Buffer
  to: Buffer
  toBalance: Buffer
  input: Buffer
}

export interface TraceModel {
  hash: Buffer;
  trace: {
    isError: boolean;
    msg: string;
    transfers: Array<TransferModel>
  }
}
