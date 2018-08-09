import { Pagination } from '@app/models'

export interface BlocksTxsPayload extends Pagination {
  hash: Buffer
}
