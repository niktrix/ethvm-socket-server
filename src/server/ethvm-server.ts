import config from '@app/config'
import { CacheDataStore, RethinkDBDataStore } from '@app/datastores'
import { logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { BlockTxStats } from '@app/libs'
import { SmallBlock, SmallTx } from '@app/models'
import { TrieDB, VmEngine, VmRunner } from '@app/vm'
import * as EventEmitter from 'eventemitter3'
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
    public readonly trieDB: TrieDB,
    public readonly vmRunner: VmRunner,
    public readonly vmEngine: VmEngine,
    public readonly ds: CacheDataStore,
    public readonly rdb: RethinkDBDataStore,
    public readonly emitter: EventEmitter
  ) {
    this.io = this.createWSServer()

    this.events = new Map()
  }

  public async start() {
    logger.debug('SocketEvent - start() / Registering emmiter callbacks')
    this.emitter.on('onNewBlock', this.onNewBlockEvent)
    this.emitter.on('onPendingTxs', this.onPendingTxsEvent)

    logger.debug('SocketEvent - start() / Registering socket events')
    const events = fs.readdirSync(`${__dirname}/events/`)
    events.forEach(async ev => {
      logger.debug(`Loading socket event: ${ev}`)
      const event = await import(`${__dirname}/events/${ev}`)
      this.events.set(event.default.name, event.default)
    })

    logger.debug('SocketEvent - start() / Starting to listen realtime events on RethinkDBDataStore')
    this.rdb.startListeningToEvents()

    logger.debug('SocketEvent - start() / Starting to listen socket events on SocketIO')
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
    logger.debug('SocketEvent - createWSServer() / Creating WebSocket server')
    const server = http.createServer()
    const host = config.get('server.host')
    const port = config.get('server.port')
    server.listen(port, host, () => {
      logger.debug(`SocketEvent - createWSServer() / Listening on ${host}:${port}`)
    })

    logger.debug('SocketEvent - createWSServer() / Creating SocketIO server')
    return SocketIO(server)
  }

  private onNewBlockEvent = (block: any): void => {
    this.vmRunner.setStateRoot(block.stateRoot)
    const bstats = new BlockTxStats(block, block.transactions)
    block.blockStats = { ...bstats.getBlockStats(), ...block.blockStats }

    const sBlock = new SmallBlock(block).smallify()
    const blockHash = sBlock.toStringHash()

    this.io.to(blockHash).emit(blockHash + '_update', sBlock)
    this.io.to('blocks').emit('newBlock', sBlock)

    this.ds.putBlock(block)

    const txs = block.transactions
      ? block.transactions.map(tx => {
          const sTx = new SmallTx(tx)
          const txHash = sTx.hash()
          this.io.to(txHash).emit(txHash + '_update', tx)
          return sTx.smallify()
        })
      : []

    if (!txs.length) {
      return
    }

    this.io.to('txs').emit('newTx', txs)
    this.ds.putTransaction(txs)
  }

  private onPendingTxsEvent = (tx: any): void => {
    if (tx.pending) {
      const sTx = new SmallTx(tx)
      const txHash = sTx.hash()
      this.io.to(txHash).emit(txHash + '_update', tx)
      this.io.to('pendingTxs').emit('newPendingTx', sTx.smallify())
    }
  }
}
