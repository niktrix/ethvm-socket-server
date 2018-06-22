import config from '@app/config'
import { RedisDataStore, RethinkDBDataStore } from '@app/datastores'
import { logger } from '@app/helpers'
import { EthVMServer } from '@app/server'
import { VmEngine, VmRunner } from '@app/vm'
import { RedisTrieDb } from '@app/vm/trie/db'

async function bootstrapServer() {
  logger.debug('Bootstraping ethvm-socket-server!')

  // Create TrieDB
  logger.debug('Initializing TrieDB')
  const trieDb = new RedisTrieDb()

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

  // Create Blockchain data store
  logger.debug('Initializing RethinkDBDataStore')
  const rdb = new RethinkDBDataStore()
  await rdb.initialize().catch(() => process.exit(-1))

  // Create server
  logger.debug('Initializing server')
  const server = new EthVMServer(trieDb, vmr, vme, ds, rdb)
  await server.start()
}

bootstrapServer()
