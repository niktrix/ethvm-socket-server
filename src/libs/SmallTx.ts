import { txLayout } from '@/typeLayouts'
import { common } from '@/libs'
import bn from 'bignumber.js'

class SmallTx {
	tx: txLayout
	constructor(_tx: txLayout) {
		this.tx = _tx
	}
	hash(): string {
		return '0x' + new Buffer(this.tx.hash).toString('hex')
	}
	smallify(): txLayout {
		let _tx = this.tx
		return {
			blockNumber: _tx.blockNumber,
			blockHash: _tx.blockHash,
			from: _tx.from,
			to: _tx.to,
			gasUsed: _tx.gasUsed,
			contractAddress: _tx.contractAddress,
			gas: _tx.gas,
			gasPrice: _tx.gasPrice,
			hash: _tx.hash,
			input: _tx.input,
			value: _tx.value,
			status: _tx.status
		}
	}
}

export default SmallTx