import config from '@app/config'
import { CacheDB, ds } from '@app/datastores'
import RethinkDBDataStore from '@app/datastores/providers/RethinkDBDataStore'
import { l } from '@app/helpers'
import { Block } from '@app/models'
import addEvents from '@app/server/socketio/addEvents'
import { VmEngine, VmRunner } from '@app/vm'
import * as http from 'http'
import * as SocketIO from 'socket.io'
import { argv } from 'yargs'

export class EthVMServer {
  private readonly io: SocketIO.Server
  private readonly cacheDB: CacheDB
  private readonly vmRunner: VmRunner
  private readonly vmEngine: VmEngine
  private readonly rdb: RethinkDBDataStore

  constructor() {
    this.io = this.createSocketIO()
    this.cacheDB = this.createCacheDB()
    this.vmRunner = this.createVmRunner()
    this.vmEngine = this.createVmEngine()
    this.rdb = this.createRethinkDBDataStore(this.io, this.vmRunner)
  }

  public async start() {
    l.info('Starting server')

    l.info('Initializing Rethink datastore')
    await this.rdb.start()

    // TODO: Refactor this initialization
    if (argv.resetDS) {
      l.info('Initializing DataStore')
      ds.initialize()
    }
    ds.getBlocks((blocks: Block[]) => {
      const configStateRoot = config.get('eth.state_root')
      const hasStateRoot = blocks && blocks[0] && blocks[0].stateRoot
      const stateRoot = hasStateRoot ? new Buffer(blocks[0].stateRoot) : new Buffer(configStateRoot, 'hex')
      this.vmRunner.setStateRoot(stateRoot) // genesis state by default
    })

    l.info('Starting VmEngine')
    this.vmEngine.start()

    l.info('Starting listening on connection in SocketIO')
    this.io.on('connection', (socket: SocketIO.Socket) => {
      addEvents(socket, this.rdb, this.cacheDB, this.vmRunner, VmEngine)
    })
  }

  private createSocketIO(): SocketIO.Server {
    l.info('Creating Http server')
    const server = http.createServer()

    const host = config.get('server.host')
    const port = config.get('server.port')

    server.listen(port, host, () => {
      l.info(`Listening on ${host}:${port}`)
    })

    l.info('Creating SocketIO server')
    return SocketIO(server)
  }

  private createCacheDB(): CacheDB {
    l.info('Creating DataStores')

    const opts = {
      redisUrl: config.get('data_stores.redis.url'),
      rpcHost: config.get('eth.rpc.host'),
      rpcPort: config.get('eth.rpc.port')
    }

    return new CacheDB(opts)
  }

  private createVmEngine(): VmEngine {
    l.info('Creating VmEngine')
    return new VmEngine()
  }

  private createVmRunner(): VmRunner {
    l.info('Creating VmRunner')
    return new VmRunner(this.cacheDB)
  }

  private createRethinkDBDataStore(io: SocketIO.Server, vmR: VmRunner): RethinkDBDataStore {
    l.info('Creating RethinkDBDataStore')
    return new RethinkDBDataStore(this.io, this.vmRunner)
  }
}
