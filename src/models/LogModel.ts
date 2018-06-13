export interface LogModel {
	address: Buffer
	topics: Array<Buffer>
	data: Buffer
	blockNumber: Buffer
	txHash: Buffer
	txIndex: Buffer
	blockHash: Buffer
	index: Buffer
	removed: boolean
}
