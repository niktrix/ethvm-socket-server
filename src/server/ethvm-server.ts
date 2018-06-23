import config from '@app/config'
import { CacheDataStore, RethinkDBDataStore } from '@app/datastores'
import { logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { TrieDB, VmEngine, VmRunner } from '@app/vm'
import * as fs from 'fs'
import * as http from 'http'
import * as SocketIO from 'socket.io'

export interface SocketEvent {
  name: string
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback) => void
}

export class EthVMServer {
  public readonly io: SocketIO.Server
  private readonly events: Map<string, SocketEvent>

  constructor(
    readonly trieDB: TrieDB,
    readonly vmRunner: VmRunner,
    readonly vmEngine: VmEngine,
    readonly ds: CacheDataStore,
    readonly rdb: RethinkDBDataStore
  ) {
    this.io = this.createWSServer()
    this.events = new Map()
  }

  public async start() {
    logger.debug('Registering socket events')
    const events = fs.readdirSync(`${__dirname}/events/`)
    events.forEach(async ev => {
      logger.debug(`Loading socket event: ${ev}`)
      const event = await import(`${__dirname}/events/${ev}`)
      this.events.set(event.name, event)
    })

    logger.debug('Starting to listen realtime events on RethinkDBDataStore')
    this.rdb.startListeningToEvents()

    logger.debug('Starting to listen socket events on SocketIO')
    this.io.on(
      'connection',
      (socket: SocketIO.Socket): void => {
        this.registerEventsOnConnection(socket)
      }
    )
  }

  private registerEventsOnConnection(socket: SocketIO.Socket): void {
    this.events.forEach((event: SocketEvent) => {
      socket.on(
        event.name,
        (msg: any, cb: Callback): void => {
          event.onEvent(this, socket, msg, cb)
        }
      )
    })
  }

  private createWSServer(): SocketIO.Server {
    logger.debug('Creating WebSocket server')
    const server = http.createServer()

    const host = config.get('server.host')
    const port = config.get('server.port')

    server.listen(port, host, () => {
      logger.debug(`Listening on ${host}:${port}`)
    })

    logger.debug('Creating SocketIO server')
    return SocketIO(server)
  }
}
