import * as Redis from 'ioredis'
import configs from '@/configs'
import { txLayout, blockLayout } from '@/typeLayouts'
interface ItableCache  {
    transactions: Array<txLayout>;
    blocks: Array<blockLayout>;
}
let redis = new Redis(configs.global.REDIS.URL)
let tableCache: ItableCache = {
    transactions: [],
    blocks: []
}
let tables = {
    transactions: "transactions",
    blocks: 'blocks'
}
type CallbackFunction = (data: Array<any>) => void;
let bufferify = (obj: any):any =>  {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && obj[key]) {
            if (obj[key].type && obj[key].type === 'Buffer') {
                obj[key] = new Buffer(obj[key])
            } else if(Array.isArray(obj[key])){
                obj[key] = obj[key].map((_item: any)=>{
                    if(_item.type && _item.type === 'Buffer') return new Buffer(_item)
                    else return _item
                })
            }
        }
    }
    return obj
}
let getArray = (tbName: any, cb: CallbackFunction) => {
    let tbKey: (keyof ItableCache) = tbName;
    if (tableCache[tbKey].length) cb(tableCache[tbKey])
    else {
        let vals = redis.get(tbName, (err, result) => {
            if (!err && result) {
                let bufferedArr = JSON.parse(result).map((_item: any) => {
                    return bufferify(_item)
                })
                tableCache[tbKey] = bufferedArr
                cb(bufferedArr)
            }
            else cb([])
        })
    }

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
        let tbKey: (keyof ItableCache) = "transactions"
        tableCache[tbKey] = pTxs
        redis.set(tables.transactions, JSON.stringify(pTxs))
    })
}
let addBlock = (block: blockLayout) => {
    getArray(tables.blocks, (pBlocks) => {
        pBlocks.unshift(block)
        if (pBlocks.length > configs.global.MAX.socketRows) pBlocks = pBlocks.slice(0, configs.global.MAX.socketRows)
        let tbKey: (keyof ItableCache) = "blocks"
        tableCache[tbKey] = pBlocks
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