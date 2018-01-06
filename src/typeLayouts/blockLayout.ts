import { txLayout } from '@/typeLayouts'
interface IblockStats {
	failed: string,
	success: string,
	avgGasPrice: string,
	avgTxFees: string
}
export default interface blockLayout {
	number: Buffer;
	intNumber: number;
	hash: Buffer,
	parentHash?: Buffer;
	nonce?: Buffer;
	mixHash?: Buffer;
	sha3Uncles?: Buffer;
	logsBloom?: Buffer;
	stateRoot?: Buffer;
	miner: Buffer;
	minerBalance?: Buffer;
	difficulty?: Buffer;
	totalDifficulty?: Buffer;
	extraData?: Buffer;
	size?: Buffer;
	gasLimit?: Buffer;
	gasUsed?: Buffer;
	timestamp: Buffer;
	transactionsRoot?: Buffer;
	receiptsRoot?: Buffer;
	transactions?: Array<txLayout>;
	transactionHashes?: Array<Buffer>
	transactionCount?: number;
	uncleHashes?: Array<Buffer>;
	uncles?: Array<blockLayout>;
	isUncle: boolean;
	txFees?: Buffer;
	blockReward?: Buffer;
	totalBlockReward?: Buffer;
	uncleReward?: Buffer;
	blockStats?: IblockStats;
}