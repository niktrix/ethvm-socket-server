import { Transfer } from '@app/models'

export interface TraceModel {
  hash: Buffer
  trace: {
    isError: boolean
    msg: string
    transfers: Transfer[]
  }
}
