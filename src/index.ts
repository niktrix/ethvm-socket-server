import addEvents from '@/addEvents'
import configs from '@/configs'
import ds from '@/datastores'
import { l } from '@/helpers'
import RethinkDB from '@/rethinkConn'
import { RethinkDBConnectionOptions } from '@/rethinkConn'
import { blockLayout } from '@/typeLayouts'
import CacheDB from '@/vm/cacheDB'
import VmEngine from '@/vm/vmEngine'
import VmRunner from '@/vm/vmRunner'
import * as http from 'http'
import * as SocketIO from 'socket.io'
import { argv } from 'yargs'
import * as fs from 'fs'

// if (argv.resetDS) { ds.initialize() }

// const server: http.Server = http.createServer();

// const io = require('socket.io')(server, configs.global.SOCKET_IO);
// server.listen(configs.global.SOCKET_IO.port, configs.global.SOCKET_IO.ip, () => {
//   console.log("Listening on", configs.global.SOCKET_IO.port)
// });

// let cacheDB = new CacheDB(configs.global.REDIS.URL, {
//   port: configs.global.GETH_RPC.port,
//   host: configs.global.GETH_RPC.host
// })

// let vmRunner = new VmRunner(cacheDB);

// let rdb = new RethinkDB(io, vmRunner)

// ds.getBlocks((_blocks: Array<blockLayout>) => {
//   vmRunner.setStateRoot(_blocks && _blocks[0] && _blocks[0].stateRoot ? new Buffer(_blocks[0].stateRoot) : new Buffer('d7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544', 'hex')) //genesis state by default
// })

// console.log("Start VmEngine")
// VmEngine.start()
// io.on('connection', (_socket: SocketIO.Socket) => {
//   addEvents(_socket, rdb, vmRunner, VmEngine)
// });


interface EthVMServerOptions {
  ip?: string
  port?: number,
  redis_url?: string,
  geth_host?: string,
  geth_port?: number,
  rethinkdb_host?: string,
  rethinkdb_port?: number,
  rethinkdb_cert?: string,
  rethinkdb_cert_raw?: string,
  rethinkdb_url?: string,
  rethinkdb_db?: string
}

class EthVMServer {

  private readonly opts: EthVMServerOptions
  private readonly server: http.Server
  private readonly io: SocketIO.Server
  private readonly vmRunner: VmRunner
  private readonly rdb: RethinkDB

  constructor(opts: EthVMServerOptions) {
    this.opts = opts
    this.server = this.createServer()
    this.io = this.createSocketIO()
    this.vmRunner = this.createVmRunner()
    this.rdb = this.createRethinkDb(this.io, this.vmRunner)
  }

  private createServer() {
    l.info('Creating Http server')
    const server = http.createServer()
    server.listen(this.opts.port, this.opts.ip, () => {
      l.info(`Listening on ${this.opts.port}`)
    })
    return server
  }

  private createSocketIO() {
    l.info('Creating SocketIO server')
    return SocketIO(this.server as any, { port: this.opts.port } as SocketIO.ServerOptions)
  }

  private createVmRunner() {
    l.info('Creating DataStores')
    const cacheDb = new CacheDB(this.opts.redis_url, {
      host: this.opts.geth_host,
      port: this.opts.geth_port
    })

    l.info('Creating VmRunner')
    return new VmRunner(cacheDb)
  }

  private createRethinkDb(io: SocketIO.Server, vmR: VmRunner) {
    l.info('Parsing RethinDB env information!')

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
    const rdbOpts: RethinkDBConnectionOptions = {}

    l.info('Creating RethinkDB')
    return new RethinkDB(this.io, this.vmRunner, rdbOpts)
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

    l.info("Starting VmEngine")
    VmEngine.start()

    l.info('Starting listening on connection in SocketIO')
    this.io.on('connection', (_socket: SocketIO.Socket) => {
      addEvents(_socket, this.rdb, this.vmRunner, VmEngine)
    })
  }
}

// Configure server with current settings
const opts = {
  ip: configs.global.SOCKET_IO.ip || 'localhost',
  port: configs.global.SOCKET_IO.port || 3000,
  redis_url: configs.global.REDIS.URL,
  geth_host: configs.global.GETH_RPC.host || 'localhost',
  geth_port: configs.global.GETH_RPC.port || 8545
}

// Create server
const server = new EthVMServer(opts)

// Kickstart server
server.start()
