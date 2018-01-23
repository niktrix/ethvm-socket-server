import { blockLayout, txLayout } from '@/typeLayouts'
import bn from 'bignumber.js'
import { common } from '@/libs'
import configs from '@/configs'
let previousBlockTime: any = new bn(0)
const BLOCK_TIME: number = configs.global.BLOCK_TIME
class BlockStats {
	private readonly txs: Array<txLayout>
	private readonly block: blockLayout
	private blockTime: any
	constructor(_block: blockLayout, _txs: Array<txLayout>){
		this.block = _block
		this.txs = _txs
		let ts = new bn(common.bufferToHex(this.block.timestamp))
		if (!previousBlockTime) previousBlockTime = ts.sub(BLOCK_TIME)
		this.blockTime = ts.sub(previousBlockTime).abs()
		if (!this.block.isUncle) previousBlockTime = new bn(common.bufferToHex(this.block.timestamp))
	}
	getBlockStats(): blockLayout['blockStats'] {
		if(!this.txs.length) return {
			blockTime: '0x0',
			failed: '0x0',
			success: '0x0',
			avgGasPrice: '0x0',
			avgTxFees: '0x0'
		}
		let txStatus = {
			blockTime: new bn(0),
			failed: new bn(0),
			success: new bn(0),
			totGasPrice: new bn(0),
			totTxFees: new bn(0)
		}
		this.txs.forEach((_tx)=>{
			if (_tx.status) txStatus.success = txStatus.success.add(1)
			else txStatus.failed = txStatus.failed.add(1)
			txStatus.totGasPrice = txStatus.totGasPrice.add(new bn(common.bufferToHex(_tx.gasPrice)))
			txStatus.totTxFees = txStatus.totTxFees.add(new bn(common.bufferToHex(_tx.gasPrice)).mul(new bn(common.bufferToHex(_tx.gasUsed))))
		})
		return {
			blockTime: common.bnToHex(this.blockTime),
			failed: common.bnToHex(txStatus.failed),
			success: common.bnToHex(txStatus.success),
			avgGasPrice: common.bnToHex(txStatus.totGasPrice.div(this.txs.length).ceil()),
			avgTxFees: common.bnToHex(txStatus.totTxFees.div(this.txs.length).ceil())
		}
	}
}

export default BlockStats