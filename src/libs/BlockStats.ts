import config from '@/config'
import { common } from '@/libs'
import { BlockModel, TxModel } from '@/models'
import bn from 'bignumber.js'

const BLOCK_TIME: number = config.get('eth_vm_server.general.block_time')
let previousBlockTime = new bn(0)

export class BlockStats {

  private blockTime

  constructor(private readonly block: BlockModel, private readonly txs: Array<TxModel>) {
    const ts = new bn(common.bufferToHex(this.block.timestamp))
    if (!previousBlockTime) {
      previousBlockTime = ts.sub(BLOCK_TIME)
    }

    this.blockTime = ts.sub(previousBlockTime).abs()
    if (!this.block.isUncle) {
      previousBlockTime = new bn(common.bufferToHex(this.block.timestamp))
    }
  }

  getBlockStats(): BlockModel['blockStats'] {
    if (!this.txs.length) return {
      blockTime: '0x0',
      failed: '0x0',
      success: '0x0',
      avgGasPrice: '0x0',
      avgTxFees: '0x0'
    }

    const txStatus = {
      blockTime: new bn(0),
      failed: new bn(0),
      success: new bn(0),
      totGasPrice: new bn(0),
      totTxFees: new bn(0)
    }

    this.txs.forEach(tx => {
      if (tx.status) {
        txStatus.success = txStatus.success.add(1)
      } else {
        txStatus.failed = txStatus.failed.add(1)
      }
      txStatus.totGasPrice = txStatus.totGasPrice.add(new bn(common.bufferToHex(tx.gasPrice)))
      txStatus.totTxFees = txStatus.totTxFees.add(new bn(common.bufferToHex(tx.gasPrice)).mul(new bn(common.bufferToHex(tx.gasUsed))))
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
