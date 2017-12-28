import Redis from '@/datastores/datastore-redis'
import LokiJS from '@/datastores/datastore-loki'
import configs from '@/configs'

let DS_TYPE: string = configs.global.DATASTORE
let VALID_DS:any = {
	Redis: <any> Redis,
	LokiJS: <any> LokiJS
}
let expObj =  {
	initialize: VALID_DS[DS_TYPE].initialize,
	addBlock: VALID_DS[DS_TYPE].addBlock,
	addTransaction: VALID_DS[DS_TYPE].addTransaction,
	getBlocks: VALID_DS[DS_TYPE].getBlocks,
	getTransactions: VALID_DS[DS_TYPE].getTransactions
}
export default expObj