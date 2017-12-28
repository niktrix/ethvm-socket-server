import * as Redis from 'ioredis'
import configs from '@/configs'
import { txLayout, blockLayout } from '@/typeLayouts'
let redis = new Redis(configs.global.REDIS.URL);

let tables = {
    transactions: 'transactions',
    blocks: 'blocks'
}
type CallbackFunction = (data: Array<any>) => void;
let getArray = (tbName: string, cb: CallbackFunction) => {
    let vals = redis.get(tbName, (err, result) => {
        if (!err && result) cb(JSON.parse(result))
        else cb([])
    })

}

let addTransaction = (tx: txLayout | Array<txLayout>): void => {
    getArray(tables.transactions, (pTxs) => {
        if (Array.isArray(tx)) {
            tx.forEach((tTx) => {
                pTxs.unshift(tTx)
            })
        } else {
            pTxs.unshift(tx)
        }
        if (pTxs.length > configs.global.MAX.socketRows) pTxs = pTxs.slice(0, configs.global.MAX.socketRows)
        redis.set(tables.transactions, JSON.stringify(pTxs))
    })
}
let addBlock = (block: blockLayout) => {
    getArray(tables.blocks, (pBlocks) => {
        pBlocks.unshift(block)
        if (pBlocks.length > configs.global.MAX.socketRows) pBlocks = pBlocks.slice(0, configs.global.MAX.socketRows)
        redis.set(tables.blocks, JSON.stringify(pBlocks))
    })
}

let getBlocks = (cb: CallbackFunction) => {
    getArray(tables.blocks, cb)
}
let getTransactions = (cb: CallbackFunction) => {
    getArray(tables.transactions, cb)
}

let thisReturnsANumber = (id: number, name: string): number => {
    return 0
}
let initialize = ():void => {
    redis.set(tables.transactions, JSON.stringify([]))
    redis.set(tables.blocks, JSON.stringify([]))
}

export default {
    addTransaction,
    addBlock,
    getBlocks,
    getTransactions,
    initialize
}