import { Pagination } from '@app/models'

export interface TxsPayload extends Pagination {
  address: string
}
