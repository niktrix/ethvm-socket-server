import config from '@/config'
import LokiJS from '@/datastores/providers/LokiDataStore'
import Redis from '@/datastores/providers/RedisDataStore'

const DS_TYPE = config.get('eth_vm_server.data_stores.provider')

const VALID_DS = {
  redis: Redis as any,
  loki: LokiJS as any
}

export default {
  initialize: VALID_DS[DS_TYPE].initialize,
  addBlock: VALID_DS[DS_TYPE].addBlock,
  addTransaction: VALID_DS[DS_TYPE].addTransaction,
  getBlocks: VALID_DS[DS_TYPE].getBlocks,
  getTransactions: VALID_DS[DS_TYPE].getTransactions
}
