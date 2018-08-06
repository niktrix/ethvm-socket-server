// TODO: Change this properties to use standard strings instead of Buffers
interface AddressTxsPagesPayload extends Pagination {
  hash: Buffer,
  number: number,
  address: Buffer
}
