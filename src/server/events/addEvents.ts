import { ds } from '@app/datastores'
import { RethinkDBDataStore} from '@app/datastores/rethinkdb-datastore'
import { logger } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { common } from '@app/libs'
import { Block, Tx } from '@app/models'
import { VmEngine, VmRunner } from '@app/vm/'
import { TrieDB } from '@app/vm/trie/db/triedb-interface'
import fetch from 'node-fetch'
import * as SocketIO from 'socket.io'

interface Instances {
  rdb: RethinkDBDataStore
  vmR: VmRunner
  vmE: VmEngine
  cacheDB: TrieDB
}

export interface SocketIOEvent {
  name: string
  onEvent: (socket: SocketIO.Socket, msg: string, glob?: Instances, cb?: Callback) => void
}

const events: SocketIOEvent[] = [
  {
    name: 'join',
    onEvent: (socket, msg): void => {
      if (!msg) {
        logger.error(socket.id, 'tried to join invalid room', msg)
        return
      }

      socket.join(msg)
      logger.debug(socket.id, 'joined', msg)
    }
  },
  {
    name: 'leave',
    onEvent: (socket, msg): void => {
      if (!msg) {
        logger.error(socket.id, 'tried to leave invalid room', msg)
        return
      }

      socket.leave(msg)
      logger.info(socket.id, 'Left', msg)
    }
  },
  {
    name: 'pastBlocks',
    onEvent: (socket, msg, glob, cb): void => {
      ds.getBlocks((_blocks: Block[]) => {
        const blocks: Block[] = []

        _blocks.forEach(
          (block: Block, idx: number): void => {
            blocks.unshift(block)
          }
        )

        cb(null, blocks)
      })
    }
  },
  {
    name: 'pastTxs',
    onEvent: (socket, msg, glob, cb): void => {
      ds.getTransactions((_txs: Tx[]) => {
        const txs: Tx[] = []

        _txs.forEach(_tx => {
          txs.unshift(_tx)
        })

        cb(null, txs)
      })
    }
  },
  {
    name: 'getBlock',
    onEvent: (socket, msg, glob, cb): void => {
      glob.rdb.getBlock(msg, cb)
    }
  },
  {
    name: 'getTx',
    onEvent: (socket, msg, glob, cb): void => {
      glob.rdb.getTx(msg, cb)
    }
  },
  {
    name: 'getBlockTransactions',
    onEvent: (socket, msg, glob, cb): void => {
      glob.rdb.getBlockTransactions(msg, cb)
    }
  },
  {
    name: 'getBalance',
    onEvent: (socket, msg, glob, cb): void => {
      glob.vmE
        .getBalance(msg)
        .then(result => cb(null, result))
        .catch(error => cb(error, null))
    }
  },
  {
    name: 'getTokenBalance',
    onEvent: (socket, msg, glob, cb): void => {
      glob.vmE
        .getAllTokens(msg)
        .then(result => cb(null, result))
        .catch(error => cb(error, null))
    }
  },
  {
    name: 'getTotalTxs',
    onEvent: (socket, msg, glob, cb): void => {
      glob.rdb.getTotalTxs(msg, cb)
    }
  },
  {
    name: 'getTxs',
    onEvent: (socket, msg, glob, cb): void => {
      glob.rdb.getTxsOfAddress(msg, cb)
    }
  },
  {
    name: 'getChartsData',
    onEvent: (socket, msg, glob, cb): void => {
      glob.rdb.getChartsData(cb)
    }
  },
  {
    name: 'ethCall',
    onEvent: (socket, msg: any, glob, cb): void => {
      glob.vmR.call(msg, cb)
    }
  },
  {
    name: 'getKeyValue',
    onEvent: (socket, msg: any, glob, cb): void => {
      if (!common.check.isBufferObject(msg, 32)) {
        cb(common.newError(common.errors.notBuffer), null)
        return
      }

      glob.cacheDB.get(
        new Buffer(msg),
        {
          keyEncoding: 'binary',
          valueEncoding: 'binary'
        },
        cb
      )
    }
  },
  {
    name: 'getCurrentStateRoot',
    onEvent: (socket, msg: any, glob, cb): void => {
      if (msg !== '') {
        cb(common.newError(common.errors.invalidInput), null)
        return
      }

      glob.vmR.getCurrentStateRoot().then(result => {
        cb(null, result)
      })
    }
  },
  {
    name: 'getEthToUSD',
    onEvent: (socket, msg, glob, cb): void => {
      // glob.cacheDB.getString(
      //   new Buffer('Iethtousd'),
      //   {
      //     keyEncoding: 'binary',
      //     valueEncoding: 'binary'
      //   },
      //   (err: Error, result: any) => {
      //     if (err == null) {
      //       l.debug('EthtoUSD is in cache get')
      //       cb(err, result)
      //     } else {
      //       l.debug('EthtoUSD getting from api')
      //       getEthToUSD((er, data) => {
      //         l.debug('data', data[0].price_usd)
      //         glob.cacheDB.put(
      //           new Buffer('Iethtousd'),
      //           new Buffer(data[0].price_usd),
      //           {
      //             keyEncoding: 'binary',
      //             valueEncoding: 'binary'
      //           },
      //           (e: Error, res: any) => {
      //             cb(e, res)
      //           }
      //         )
      //         cb(er, result)
      //       })
      //     }
      //   }
      // )
    }
  },
  {
    name: 'getTransactionPages',
    onEvent: (socket, msg: any, glob, cb): void => {
      if (msg.hash && (!common.check.isBufferObject(msg.hash, 32) || !common.check.isNumber(msg.number))) {
        cb(common.newError(common.errors.notBuffer), null)
        return
      }

      glob.rdb.getTransactionPages(msg.hash, msg.number, cb)
    }
  },
  {
    name: 'getAddressTransactionPages',
    onEvent: (socket, msg: any, glob, cb): void => {
      if (msg.hash && (!common.check.isBufferObject(msg.hash, 32) || !common.check.isNumber(msg.number))) {
        cb(common.newError(common.errors.notBuffer), null)
        return
      }

      if (!common.check.isBufferObject(msg.address, 20)) {
        cb(common.newError(common.errors.notBuffer), null)
        return
      }

      glob.rdb.getAddressTransactionPages(msg.address, msg.hash, msg.number, cb)
    }
  }
]

const onConnection = (socket: SocketIO.Socket, rdb: RethinkDBDataStore, cacheDB: TrieDB, vmR: VmRunner, vmE: any) => {
  events.forEach((event: SocketIOEvent) => {
    socket.on(event.name, (msg: any, cb: Callback) => {
      event.onEvent(
        socket,
        msg,
        {
          rdb,
          vmR,
          vmE,
          cacheDB
        },
        cb
      )
    })
  })
}

async function getEthToUSD(cb: (error: Error, data: any) => void) {
  const res = await fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/')
  const json = await res.json()
  return cb(null, json)
}

export default onConnection
