export * from '@app/datastores/interfaces'
export * from '@app/datastores/rethinkdb-datastore'

import config from '@app/config'
import LokiJS from '@app/datastores/loki-datastore'
import Redis from '@app/datastores/redis-datastore'

const DS_TYPE = config.get('data_stores.provider')

const VALID_DS = {
  redis: Redis as any,
  loki: LokiJS as any
}

export const ds = {
  initialize: VALID_DS[DS_TYPE].initialize,
  addBlock: VALID_DS[DS_TYPE].addBlock,
  addTransaction: VALID_DS[DS_TYPE].addTransaction,
  getBlocks: VALID_DS[DS_TYPE].getBlocks,
  getTransactions: VALID_DS[DS_TYPE].getTransactions
}
