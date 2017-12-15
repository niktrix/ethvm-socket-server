import {
    LRUMap
} from 'lru_map'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import configs from './configs/global.json'
import lowDefaults from './configs/lowdbDefaults.json'

const adapter = new FileSync(configs.dbName)
const db = low(adapter)

db.defaults(lowDefaults).write()
let txs = new LRUMap(configs.lru.maxTxs)
let blocks = new LRUMap(configs.lru.maxBlocks)
let test = "abc"

let addTx = (hash, tx) => {
    txs.set(hash, tx)
}
let addBlock = (hash, block) => {
    blocks.set(hash, block)
}
let getBlocks = () => {
    return blocks
}
let getTxs = () => {
    return txs
}
let loadLRUFromFile = () => {
    txs.clear()
    blocks.clear()
    db.get('txs').value().forEach((tx, idx) => {
        txs.set(tx.key, tx.value)
    })
    db.get('blocks').value().forEach((block, idx) => {
        blocks.set(block.key, block.value)
    })
}
let saveLRUToFile = () => {
    db.set('txs', txs.toJSON()).write()
    db.set('blocks', blocks.toJSON()).write()
}
let saveTxs = () => {
    db.set('txs', txs.toJSON()).write()
}
let saveBlocks = () => {
    db.set('blocks', blocks.toJSON()).write()
}

export {
    addTx,
    addBlock,
    loadLRUFromFile,
    saveLRUToFile,
    getBlocks,
    getTxs
}