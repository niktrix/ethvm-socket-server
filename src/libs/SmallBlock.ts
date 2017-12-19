import { blockLayout, txLayout } from '@/typeLayouts'
import bn from 'bignumber.js'

class SmallBlock {
	block: blockLayout
	constructor(_block: blockLayout) {
		this.block = _block
	}
	smallify(): blockLayout {
		let _block = this.block
		return {
			number: _block.number,
			intNumber: _block.intNumber,
			hash: _block.hash,
			miner: _block.miner,
			timestamp: _block.timestamp,
			transactionCount: _block.transactions.length,
			uncleHashes: _block.uncleHashes,
			uncles: _block.uncles ? _block.uncles : [],
			isUncle: _block.isUncle,
			totalBlockReward: '0x' + new bn(_block.blockReward).plus(new bn(_block.txFees)).toString(16)
		}
	}
}

export default SmallBlock