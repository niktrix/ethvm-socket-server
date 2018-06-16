export interface BlockStats {
  blockTime: string
  failed: string
  success: string
  avgGasPrice: string
  avgTxFees: string
  pendingTxs?: number
}
