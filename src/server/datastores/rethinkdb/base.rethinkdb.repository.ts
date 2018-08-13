import { Repository } from '@app/server/datastores'
import { Connection, ConnectOptions as RethinkConnectionOpts } from 'rethinkdb'

export const RethinkEthVM = {
  tables: {
    blocks: 'blocks',
    txs: 'transactions',
    blocks_metrics: 'blocks_metrics'
  },
  indexes: {}
}

export abstract class BaseRethinkDbRepository implements Repository {
  constructor(protected readonly conn: Connection, protected readonly opts: RethinkConnectionOpts) {}
}
