import * as loki from 'lokijs'
import configs from '@/configs'
import { txLayout, blockLayout } from '@/typeLayouts'
let lokiDB = new loki(configs.global.LOKI.dbName, { autosave: true, autosaveInterval: 5000, autoload: true })
let tables = configs.global.LOKI.tableNames
let setCollections = (): void => {
    tables.forEach((item: string, idx: number): void => {
        if (!lokiDB.getCollection(item)) lokiDB.addCollection(item).setTTL(configs.global.LOKI.ttl.age, configs.global.LOKI.ttl.interval)
    })
}
setCollections()
let addTransaction = (tx: txLayout): void => {
    lokiDB.getCollection('transactions').insert(tx)
}
let addBlock = (block: blockLayout) => {
    lokiDB.getCollection('blocks').insert(block)
}
let getBlocks = (): Array<blockLayout> => {
    return lokiDB.getCollection('blocks').chain().simplesort('blockNumber').data()
}
let getTransactions = () => {
    return lokiDB.getCollection('transactions').chain().simplesort('blockNumber').data()
}

let thisReturnsANumber =(id: number, name: string): number => {
    return 0
}

export {
    addTransaction,
    addBlock,
    getBlocks,
    getTransactions
}