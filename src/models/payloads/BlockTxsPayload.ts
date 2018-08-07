import { Pagination } from '@app/models'

export interface BlocksTxsPayload extends Pagination {
  address: string
}
