import * as loki from 'lokijs'
import configs from '@/configs'
import { txLayout, blockLayout } from '@/typeLayouts'
let lokiDB = new loki(configs.global.LOKI.dbName)
let tables = configs.global.LOKI.tableNames
let setCollections = (): void => {
    tables.forEach((item: string, idx: number): void => {
        if (!lokiDB.getCollection(item)) lokiDB.addCollection(item).setTTL(configs.global.LOKI.ttl.age, configs.global.LOKI.ttl.interval)
    })
}
let addTransaction = (tx: txLayout): void => {
    lokiDB.getCollection('transactions').insert(tx)
}
let addBlock = (block: blockLayout) => {
    lokiDB.getCollection('blocks').insert(block)
}
let getBlocks = (): Array<blockLayout> => {
    return lokiDB.getCollection('blocks').where((obj) => { return true })
}
let getTransactions = () => {
    return lokiDB.getCollection('transactions').where((obj) => { return true })
}

export {
    addTransaction,
    addBlock,
    getBlocks,
    getTransactions
}