import { Pagination } from '@app/server/payloads'

export interface TxsPayload extends Pagination {
  address: string
}
