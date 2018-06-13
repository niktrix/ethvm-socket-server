import addEvents from '@/server/addEvents'
import ds from '@/datastores'
import { l } from '@/helpers'
import RethinkDBDataStore from '@/datastores/providers/RethinkDBDataStore'
import { BlockModel } from '@/models'
import CacheDB from '@/vm/cacheDB'
import VmEngine from '@/vm/vmEngine'
import VmRunner from '@/vm/vmRunner'
import * as http from 'http'
import * as SocketIO from 'socket.io'
import { argv } from 'yargs'
import config from '@/config'

export class EthVMServer {

  private readonly server: http.Server
  private readonly io: SocketIO.Server
  private readonly vmRunner: VmRunner
  private readonly rdb: RethinkDBDataStore

  constructor() {
    this.server = this.createHttpServer()
    this.io = this.createSocketIO()
    this.vmRunner = this.createVmRunner()
    this.rdb = this.createRethinkDBDataStore(this.io, this.vmRunner)
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

    const port = config.get('eth_vm_server.socket_io.port')

    return SocketIO(this.server as any, { port } as SocketIO.ServerOptions)
  }

  private createVmRunner(): VmRunner {
    l.info('Creating DataStores')

    const redisUrl = config.get('eth_vm_server.data_stores.redis.url')
    const host = config.get('eth_vm_server.geth.host')
    const port = config.get('eth_vm_server.geth.port')

    const cacheDb = new CacheDB(redisUrl, {
      host,
      port
    })

    l.info('Creating VmRunner')
    return new VmRunner(cacheDb)
  }

  private createRethinkDBDataStore(io: SocketIO.Server, vmR: VmRunner): RethinkDBDataStore {
    l.info('Creating RethinkDBDataStore')
    return new RethinkDBDataStore(this.io, this.vmRunner)
  }

  async start() {
    l.info('Starting server')

    l.info('Initializing Rethink datastore')
    await this.rdb.start()

    // TODO: Refactor this initialization
    if (argv.resetDS) {
      l.info('Initializing DataStore')
      ds.initialize()
    }
    ds.getBlocks((blocks: Array<BlockModel>) => {
      this.vmRunner.setStateRoot(blocks && blocks[0] && blocks[0].stateRoot ? new Buffer(blocks[0].stateRoot) : new Buffer('d7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544', 'hex')) //genesis state by default
    })

    l.info('Starting VmEngine')
    VmEngine.start()

    l.info('Starting listening on connection in SocketIO')
    this.io.on('connection', (socket: SocketIO.Socket) => {
      addEvents(socket, this.rdb, this.vmRunner, VmEngine)
    })
  }
}
