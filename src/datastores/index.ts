import Redis from '@/datastores/datastore-redis'
import LokiJS from '@/datastores/datastore-loki'
import config from '@/config'

const DS_TYPE: string = config.get('eth_vm_server.data_stores.provider')

const VALID_DS = {
  redis: <any>Redis,
  loki: <any>LokiJS
}

export default {
  initialize: VALID_DS[DS_TYPE].initialize,
  addBlock: VALID_DS[DS_TYPE].addBlock,
  addTransaction: VALID_DS[DS_TYPE].addTransaction,
  getBlocks: VALID_DS[DS_TYPE].getBlocks,
  getTransactions: VALID_DS[DS_TYPE].getTransactions
}
