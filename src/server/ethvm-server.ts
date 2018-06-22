import config from '@app/config'
import { CacheDataStore, RethinkDBDataStore } from '@app/datastores'
import { logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { TrieDB, VmEngine, VmRunner } from '@app/vm'
import * as http from 'http'
import * as SocketIO from 'socket.io'

export interface SocketEvent {
  name: string
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback) => void
}

export class EthVMServer {
  public readonly io: SocketIO.Server
  public readonly events: Map<string, SocketEvent>

  constructor(
    readonly trieDB: TrieDB,
    readonly vmRunner: VmRunner,
    readonly vmEngine: VmEngine,
    readonly ds: CacheDataStore,
    readonly rdb: RethinkDBDataStore
  ) {
    this.io = this.createWSServer()
    this.events = this.loadEvents()
  }

  public async start() {
    logger.debug('Starging to listen realtime events on RethinkDBDataStore')
    this.rdb.startListeningToEvents()

    logger.debug('Starting listening WS events on SocketIO')
    this.io.on(
      'connection',
      (socket: SocketIO.Socket): void => {
        this.registerEventsOnConnection(socket)
      }
    )
  }

  private loadEvents(): Map<string, SocketEvent> {
    return new Map()
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
