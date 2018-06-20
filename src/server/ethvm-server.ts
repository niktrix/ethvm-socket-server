import config from '@app/config'
import { RethinkDBDataStore } from '@app/datastores'
import { logger } from '@app/helpers'
import { SocketIOEvent } from '@app/server/events'
import { TrieDB, VmEngine, VmRunner } from '@app/vm'
import * as http from 'http'
import * as SocketIO from 'socket.io'

export class EthVMServer {
  private readonly io: SocketIO.Server

  constructor(
    private readonly trieDB: TrieDB,
    private readonly vmRunner: VmRunner,
    private readonly vmEngine: VmEngine,
    private readonly rdb: RethinkDBDataStore,
    private readonly events: SocketIOEvent[]
  ) {
    this.io = this.createSocketIO()
    this.events = this.registerEvents()
  }

  public async start() {
    logger.info('Starting listening on connection in SocketIO')
    this.io.on('connection', (socket: SocketIO.Socket) => {
      // addEvents(socket, this.rdb, this.trieDB, this.vmRunner, VmEngine)
      this.registerEvents()
    })
  }

  private registerEvents(): SocketIOEvent[] {
    return []
  }

  private createSocketIO(): SocketIO.Server {
    logger.debug('Creating Http server')
    const server = http.createServer()

    const host = config.get('server.host')
    const port = config.get('server.port')

    server.listen(port, host, () => {
      logger.info(`Listening on ${host}:${port}`)
    })

    logger.info('Creating SocketIO server')
    return SocketIO(server)
  }
}
