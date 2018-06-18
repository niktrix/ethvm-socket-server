import { Transfer } from '@app/models'

export class TraceModel {
  public hash: Buffer
  public trace: {
    isError: boolean
    msg: string
    transfers: Transfer[]
  }
}
