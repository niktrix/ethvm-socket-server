import config from '@app/config'
import { BlockchainDataStore, CacheDataStore } from '@app/datastores'
import { errors, logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import {
  AddressTxsPagesPayload,
  BalancePayload,
  Block,
  BlocksTxsPayload,
  ChartPayload,
  EthCallPayload,
  ExchangeRatePayload,
  JoinPayload,
  LeavePayload,
  TokensBalancePayload,
  Tx,
  TxsPayload
} from '@app/models'
import { mappers } from '@app/models/helpers'
import { TrieDB, VmEngine, VmRunner } from '@app/vm'
import { bufferToHex } from 'ethereumjs-util'
import * as EventEmitter from 'eventemitter3'
import * as fs from 'fs'
import * as http from 'http'
import _ from 'lodash'
import * as SocketIO from 'socket.io'

export type SocketEventPayload =
  | AddressTxsPagesPayload
  | BalancePayload
  | BlocksTxsPayload
  | Buffer
  | ChartPayload
  | EthCallPayload
  | ExchangeRatePayload
  | JoinPayload
  | LeavePayload
  | TokensBalancePayload
  | TxsPayload
  | any

export type SocketEventResponse = Block | Block[] | Tx | Tx[] | number | any

export interface SocketEventValidationResult {
  readonly valid: boolean
  readonly errors?: any[]
}

export interface SocketEvent {
  id: string
  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any) => SocketEventValidationResult
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload?: SocketEventPayload) => Promise<SocketEventResponse>
}

export class EthVMServer {
  public readonly io: SocketIO.Server

  private readonly events: Map<string, SocketEvent>

  constructor(
    public readonly trieDB: TrieDB,
    public readonly vmRunner: VmRunner,
    public readonly vmEngine: VmEngine,
    public readonly ds: CacheDataStore,
    public readonly rdb: BlockchainDataStore,
    public readonly emitter: EventEmitter
  ) {
    this.io = this.createWSServer()
    this.events = new Map()
  }

  public async start() {
    logger.debug('EthVMServer - start() / Registering emitter callbacks')
    this.emitter.on('onNewBlock', this.onNewBlockEvent)
    this.emitter.on('onPendingTxs', this.onPendingTxsEvent)

    logger.debug('EthVMServer - start() / Loading socket evens...')
    const events = fs.readdirSync(`${__dirname}/events/`)
    events.forEach(async ev => {
      logger.debug(`EthVMServer - start() / Registering socket event: ${ev}`)
      const event = await import(`${__dirname}/events/${ev}`)
      this.events.set(event.default.name, event.default)
    })

    logger.debug('EthVMServer - start() / Starting RethinkDB datastore')
    await this.rdb.initialize().catch(() => process.exit(-1))

    logger.debug('EthVMServer - start() / Starting to listen socket events on SocketIO')
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
        event.id,
        (payload: any, cb: Callback): void => {
          const validationResult = event.onValidate(this, socket, payload)
          if (!validationResult.valid) {
            logger.error(`event -> ${event.id} / Invalid payload: ${payload}`)
            cb(validationResult.errors, null)
            return
          }

          event
            .onEvent(this, socket, payload)
            .then(res => {
              // Some events like join, leave doesn't produce a concrete result
              if (_.isUndefined(res)) {
                return
              }

              cb(null, res)
            })
            .catch(err => {
              logger.error(`event -> ${event.id} / Error: ${err}`)

              // TODO: Until we have defined which errors are we going to return, we use a generic one
              cb(errors.serverError, null)
            })
        }
      )
    })
  }

  private createWSServer(): SocketIO.Server {
    logger.debug('EthVMServer - createWSServer() / Creating SocketIO server')
    const server = http.createServer()
    const host = config.get('server.host')
    const port = config.get('server.port')

    server.listen(port, host, () => {
      logger.debug(`EthVMServer - createWSServer() / Web server listening on ${host}:${port}`)
    })

    return SocketIO(server)
  }

  private onNewBlockEvent = (block: Block): void => {
    logger.info(`EthVMServer - onNewBlockEvent / Block: ${bufferToHex(block.hash)}`)

    if (block.stateRoot) {
      this.vmRunner.setStateRoot(block.stateRoot)
    }
    const bstats = mappers.toBlockStats(block, block.transactions)
    block.blockStats = { ...bstats, ...block.blockStats }

    const blockHash = bufferToHex(block.hash)
    const smallBlock = mappers.toSmallBlock(block)

    this.io.to(blockHash).emit(blockHash + '_update', smallBlock)
    this.io.to('blocks').emit('newBlock', smallBlock)

    this.ds.putBlock(block)

    const txs = block.transactions || []
    if (txs.length > 0) {
      txs.forEach(tx => {
        const txHash = bufferToHex(tx.hash)
        this.io.to(txHash).emit(txHash + '_update', tx)
      })
      this.io.to('txs').emit('newTx', txs)
      this.ds.putTransactions(txs)
    }
  }

  private onPendingTxsEvent = (tx: any): void => {
    logger.info(`EthVMServer - onPendingTxsEvent / Tx: ${tx}`)

    if (tx.pending) {
      const txHash = bufferToHex(tx.hash)
      this.io.to(txHash).emit(txHash + '_update', tx)
      this.io.to('pendingTxs').emit('newPendingTx', tx)
    }
  }
}
