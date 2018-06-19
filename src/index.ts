import { EthVMServer } from '@app/server'
import { logger } from '@app/helpers'
import { RedisTrieDb } from '@app/vm/trie/db'
import { VmRunner, VmEngine } from '@app/vm'
import { RethinkDBDataStore, ds } from '@app/datastores'

// Bootstrap app
async function bootstrap() {
  logger.debug('Bootstraping ethvm-socket-server!')

  // Create TrieDB
  logger.debug('Initializing TrieDB')
  const trieDb = new RedisTrieDb()

  // Create VmRunner
  logger.debug('Initializing VmRunner')
  const vmr = new VmRunner(trieDb)

  // Create VmEngine
  logger.debug('Initializing VmEngine')
  const vme = new VmEngine()
  vme.start()

  // Create Cache data store
  logger.info('Initializing Cache DataStore')
  ds.initialize()
  // TODO: Move below code to initialize fn
  // ds.getBlocks((blocks: Block[]) => {
  //   const configStateRoot = config.get('eth.state_root')
  //   const hasStateRoot = blocks && blocks[0] && blocks[0].stateRoot
  //   const stateRoot = hasStateRoot ? new Buffer(blocks[0].stateRoot) : new Buffer(configStateRoot, 'hex')
  //   this.vmRunner.setStateRoot(stateRoot) // genesis state by default
  // })

  // Create Blockchain data store
  logger.debug('Initializing RethinkDBDataStore')
  // TODO: Pass properly an event emitter
  const rdb = new RethinkDBDataStore(null, vmr)
  await rdb.initialize().catch(() => {
    process.exit(-1)
  })

  // Create server
  logger.debug('Initializing server')
  const server = new EthVMServer(trieDb, vmr, vme, rdb)
  await server.start()
}

bootstrap()
