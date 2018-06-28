import config from '@app/config'
import { Block, BlockStats, Tx } from '@app/models'
import { BigNumber }  from 'bignumber.js'
import * as utils from 'web3-utils'

const BLOCK_TIME: number = config.get('eth.block_time')
let previousBlockTime = new BigNumber(0)

export class BlockTxStats {
  private blockTime

  constructor(private readonly block: Block, private readonly txs: Tx[]) {
    const ts = new BigNumber(utils.toHex(this.block.timestamp))
    if (!previousBlockTime) {
      previousBlockTime = ts.minus(BLOCK_TIME)
    }

    this.blockTime = ts.minus(previousBlockTime).abs()
    if (!this.block.isUncle) {
      previousBlockTime = new BigNumber(utils.toHex(this.block.timestamp))
    }
  }

  public getBlockStats(): BlockStats {
    if (!this.txs.length) {
      return {
        blockTime: '0x0',
        failed: '0x0',
        success: '0x0',
        avgGasPrice: '0x0',
        avgTxFees: '0x0'
      }
    }

    const txStatus = {
      blockTime: new BigNumber(0),
      failed: new BigNumber(0),
      success: new BigNumber(0),
      totGasPrice: new BigNumber(0),
      totTxFees: new BigNumber(0)
    }

    this.txs.forEach(tx => {
      if (tx.status) {
        txStatus.success = txStatus.success.plus(1)
      } else {
        txStatus.failed = txStatus.failed.plus(1)
      }
      txStatus.totGasPrice = txStatus.totGasPrice.plus(new BigNumber(utils.toHex(tx.gasPrice)))
      txStatus.totTxFees = txStatus.totTxFees.plus(new BigNumber(utils.toHex(tx.gasPrice)).times(new BigNumber(utils.toHex(tx.gasUsed))))
    })

    return {
      blockTime: utils.toHex(this.blockTime),
      failed: utils.toHex(txStatus.failed),
      success: utils.toHex(txStatus.success),
      avgGasPrice: utils.toHex(txStatus.totGasPrice.div(this.txs.length).integerValue(BigNumber.ROUND_CEIL)),
      avgTxFees: utils.toHex(txStatus.totTxFees.div(this.txs.length).integerValue(BigNumber.ROUND_CEIL))
    }
  }
}
