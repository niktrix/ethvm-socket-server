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
let hexify  = (obj: any) => {
    let _obj = Object.assign({}, obj);
    for (var key in _obj) {
        if (_obj.hasOwnProperty(key)) {
            if(Buffer.isBuffer(_obj[key])) _obj[key] = '0x'+ _obj[key].toString('hex')
        }
    }
    return _obj
}
let bufferify = (obj: any) => {
    let _obj = Object.assign({}, obj);
    for (var key in _obj) {
        if (_obj.hasOwnProperty(key)) {
            if ((typeof _obj[key] === 'string' || _obj[key] instanceof String) && _obj[key].substring(0, 2) == '0x') _obj[key] = new Buffer(_obj[key].substring(2).toUpperCase(), 'hex')
        }
    }
    return _obj
}
setCollections()
let addTransaction = (tx: txLayout): void => {
    lokiDB.getCollection('transactions').insert(hexify(tx))
}
let addBlock = (block: blockLayout) => {
    lokiDB.getCollection('blocks').insert(hexify(block))
}
let getBlocks = (): Array<blockLayout> => {
    return lokiDB.getCollection('blocks').chain().simplesort('blockNumber').data().map((_block)=>{
        return bufferify(_block)
    })
}
let getTransactions = () => {
    return lokiDB.getCollection('transactions').chain().simplesort('blockNumber').data().map((_tx)=>{
        return bufferify(_tx)
    })
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