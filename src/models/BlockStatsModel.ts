export interface BlockStatsModel {
	blockTime: string
	failed: string
	success: string
	avgGasPrice: string
	avgTxFees: string
	pendingTxs?: number
}
