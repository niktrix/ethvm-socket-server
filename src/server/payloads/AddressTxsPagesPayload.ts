import { Pagination } from '@app/server/payloads'

// TODO: Change this properties to use standard strings instead of Buffers
export interface AddressTxsPagesPayload extends Pagination {
  hash: Buffer
  number: number
  address: Buffer
}
