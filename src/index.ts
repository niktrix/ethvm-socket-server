import configs from '@/configs'
import * as http from 'http'
import RethinkDB from '@/rethinkConn'
import addEvents from '@/addEvents'
import * as SocketIO from 'socket.io'
import ds from '@/datastores'
import { argv } from 'yargs'
import CacheDB from '@/vm/cacheDB'
import VmRunner from '@/vm/vmRunner'
import { blockLayout } from '@/typeLayouts'

if(argv.resetDS) ds.initialize()
const server:http.Server = http.createServer();

const io = require('socket.io')(server, configs.global.SOCKET_IO);
server.listen(configs.global.SOCKET_IO.port, configs.global.SOCKET_IO.ip, () => {
	console.log("Listening on", configs.global.SOCKET_IO.port)
});
let cacheDB = new CacheDB(configs.global.REDIS.URL, {
	port: configs.global.GETH_RPC.port,
	host: configs.global.GETH_RPC.host
})
let vmRunner = new VmRunner(cacheDB);
let rdb = new RethinkDB(io, vmRunner)
ds.getBlocks((_blocks: Array<blockLayout>)=>{
	vmRunner.setStateRoot(new Buffer(_blocks[0].stateRoot))
})
io.on('connection', (_socket: SocketIO.Socket) => { 
	addEvents(_socket, rdb, vmRunner)
});