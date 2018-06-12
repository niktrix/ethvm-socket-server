import addEvents from '@/server/addEvents'
import ds from '@/datastores'
import { l } from '@/helpers'
import { RethinkDB } from '@/rethinkConn'
import { blockLayout } from '@/typeLayouts'
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
  private readonly rdb: RethinkDB

  constructor() {
    this.server = this.createHttpServer()
    this.io = this.createSocketIO()
    this.vmRunner = this.createVmRunner()
    this.rdb = this.createRethinkDB(this.io, this.vmRunner)
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

  private createRethinkDB(io: SocketIO.Server, vmR: VmRunner): RethinkDB {
    l.info('Parsing RethinDB configuration options!')

    // TODO: Finish connectivity

    // const conf = configs.global.RETHINK_DB
    // const connectWithCert = cert => {
    //   let url = new URL(process.env[conf.env_url])
    //   const tempConfig = {
    //     host: url.hostname,
    //     port: parseInt(url.port),
    //     password: url.password,
    //     ssl: {
    //       ca: cert
    //     },
    //     db: conf.db
    //   }

    //   if (!cert) {
    //     delete tempConfig.ssl
    //   }

    //   connect(tempConfig)
    // }

    // if (argv.remoteRDB && !argv.rawCert) {
    //   fs.readFile(process.env[conf.env_cert], (err, caCert) => {
    //     connectWithCert(caCert)
    //   })
    // } else if (argv.remoteRDB && argv.rawCert) {
    //   connectWithCert(process.env[conf.env_cert_raw])
    // } else {
    //   const tempConfig = {
    //     host: conf.host,
    //     port: conf.port,
    //     db: conf.db
    //   }
    //   connect(tempConfig)
    // }

    l.info('Creating RethinkDB')
    return new RethinkDB(this.io, this.vmRunner)
  }

  async start() {
    l.info('Starting server')

    if (argv.resetDS) {
      l.info('Initializing DataStore')
      ds.initialize()
    }
    ds.getBlocks((blocks: Array<blockLayout>) => {
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
