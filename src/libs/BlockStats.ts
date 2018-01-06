import { blockLayout, txLayout } from '@/typeLayouts'
import bn from 'bignumber.js'
import { common } from '@/libs'
class BlockStats {
	private readonly txs: Array<txLayout>
	private readonly block: blockLayout
	constructor(_block: blockLayout, _txs: Array<txLayout>){
		this.block = _block
		this.txs = _txs
	}
	getBlockStats(): blockLayout['blockStats'] {
		if(!this.txs.length) return {
			failed: '0x0',
			success: '0x0',
			avgGasPrice: '0x0',
			avgTxFees: '0x0'
		}
		let txStatus = {
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
			failed: common.bnToHex(txStatus.failed),
			success: common.bnToHex(txStatus.success),
			avgGasPrice: common.bnToHex(txStatus.totGasPrice.div(this.txs.length).ceil()),
			avgTxFees: common.bnToHex(txStatus.totTxFees.div(this.txs.length).ceil())
		}
	}
}

export default BlockStats