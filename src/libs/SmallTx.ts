import { TxModel } from '@/models'
import { common } from '@/libs'
import bn from 'bignumber.js'

export class SmallTx {

	constructor(private readonly tx: TxModel) {
  }

	hash(): string {
		return '0x' + new Buffer(this.tx.hash).toString('hex')
  }

	smallify(): TxModel {
		return {
			blockNumber: this.tx.blockNumber,
			blockHash: this.tx.blockHash,
			from: this.tx.from,
			to: this.tx.to,
			gasUsed: this.tx.gasUsed,
			contractAddress: this.tx.contractAddress,
			gas: this.tx.gas,
			gasPrice: this.tx.gasPrice,
			hash: this.tx.hash,
			input: this.tx.input,
			value: this.tx.value,
			status: this.tx.status,
			timestamp: this.tx.timestamp
		}
	}
}
