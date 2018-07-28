import config from '@app/config'
import { RedisDataStore, RethinkDBDataStore } from '@app/datastores'
import { logger } from '@app/helpers'
import { EthVMServer } from '@app/server'
import { VmEngine, VmRunner } from '@app/vm'
import { RedisTrieDb } from '@app/vm/trie/db'
import * as EventEmitter from 'eventemitter3'

async function bootstrapServer() {
  logger.debug('Bootstraping ethvm-socket-server!')

  // Create TrieDB
  logger.debug('Initializing TrieDB')
  const redisOpts:any = {
    host: config.get('data_stores.redis.host'),
    port: config.get('data_stores.redis.port')
  }
  const trieDb = new RedisTrieDb(redisOpts)

  // Create VmEngine
  logger.debug('Initializing VmEngine')
  const vme = new VmEngine()
  vme.start()

  // Create Cache data store
  logger.info('Initializing Cache DataStore')
  const ds = new RedisDataStore()
  await ds.initialize().catch(() => process.exit(-1))

  // Create VmRunner
  logger.debug('Initializing VmRunner')
  const vmr = new VmRunner(trieDb)

  // Set default state block to VmRunner
  const blocks = await ds.getBlocks()
  const configStateRoot = config.get('eth.state_root')
  const hasStateRoot = blocks && blocks[0] && blocks[0].stateRoot
  const stateRoot = hasStateRoot ? new Buffer(blocks[0].stateRoot!!) : new Buffer(configStateRoot, 'hex')
  vmr.setStateRoot(stateRoot)

  // Create block event emmiter
  logger.debug('Initializing event emitter')
  const emitter = new EventEmitter()

  // Create Blockchain data store
  logger.debug('Initializing RethinkDBDataStore')

   const rethinkdbOpts:any = {
    host: config.get('rethink_db.host'),
    port: config.get('rethink_db.port'),
    db: config.get('rethink_db.db_name')
  }
  if (config.get('rethink_db.user')) {
    rethinkdbOpts.user = config.get('rethink_db.user')
    }
  if (config.get('rethink_db.password')) {
    rethinkdbOpts.password = config.get('rethink_db.password')
    }
  if (config.get('rethink_db.cert_raw')) {
    rethinkdbOpts.ssl = {
      cert: config.get('rethink_db.cert_raw')
    }
  }
  const rdb = new RethinkDBDataStore(emitter,rethinkdbOpts)
  await rdb.initialize().catch(() => process.exit(-1))

  // Create server
  logger.debug('Initializing server')
  const server = new EthVMServer(trieDb, vmr, vme, ds, rdb, emitter)
  await server.start()
}

bootstrapServer()
