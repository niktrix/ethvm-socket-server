import config from '@app/config'
import { CacheDB, ds } from '@app/datastores'
import RethinkDBDataStore from '@app/datastores/providers/RethinkDBDataStore'
import { l } from '@app/helpers'
import { BlockModel } from '@app/models'
import addEvents from '@app/server/socketio/addEvents'
import { VmEngine, VmRunner } from '@app/vm'
import * as http from 'http'
import * as SocketIO from 'socket.io'
import { argv } from 'yargs'

export class EthVMServer {
  private readonly server: http.Server
  private readonly io: SocketIO.Server
  private readonly cacheDB: CacheDB
  private readonly vmRunner: VmRunner
  private readonly rdb: RethinkDBDataStore

  constructor() {
    this.server = this.createHttpServer()
    this.io = this.createSocketIO()
    this.cacheDB = this.createCacheDB()
    this.vmRunner = this.createVmRunner()
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
    ds.getBlocks((blocks: BlockModel[]) => {
      const stateRoot =
        blocks && blocks[0] && blocks[0].stateRoot
          ? new Buffer(blocks[0].stateRoot)
          : new Buffer('d7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544', 'hex')
      this.vmRunner.setStateRoot(stateRoot) // genesis state by default
    })

    l.info('Starting VmEngine')
    VmEngine.start()

    l.info('Starting listening on connection in SocketIO')
    this.io.on('connection', (socket: SocketIO.Socket) => {
      addEvents(socket, this.rdb, this.cacheDB, this.vmRunner, VmEngine)
    })
  }

  private createHttpServer(): http.Server {
    l.info('Creating Http server')
    const server = http.createServer()

    const host = config.get('eth_vm_server.socket_io.host')
    const port = config.get('eth_vm_server.socket_io.port')

    server.listen(port, host, () => {
      l.info(`Listening on ${host}:${port}`)
    })

    return server
  }

  private createSocketIO(): SocketIO.Server {
    l.info('Creating SocketIO server')
    return SocketIO(this.server)
  }

  private createCacheDB(): CacheDB {
    l.info('Creating DataStores')

    const opts = {
      redisUrl: config.get('eth_vm_server.data_stores.redis.url'),
      rpcHost: config.get('eth_vm_server.geth.host'),
      rpcPort: config.get('eth_vm_server.geth.port')
    }

    return new CacheDB(opts)
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
