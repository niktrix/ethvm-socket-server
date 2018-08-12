import { Pagination } from '@app/server/payloads'

export interface BlocksTxsPayload extends Pagination {
  hash: Buffer
}
