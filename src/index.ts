import configs from '@/configs'
import * as http from 'http'
import RethinkDB from '@/rethinkConn'
import addEvents from '@/addEvents'
import * as SocketIO from 'socket.io'
import ds from '@/datastores'
import { argv } from 'yargs'

if(argv.resetDS) ds.initialize()
const server:http.Server = http.createServer();

const io = require('socket.io')(server, configs.global.SOCKET_IO);
server.listen(configs.global.SOCKET_IO.port, configs.global.SOCKET_IO.ip, () => {
	console.log("Listening on", configs.global.SOCKET_IO.port)
});
let rdb = new RethinkDB(io)
io.on('connection', (_socket: SocketIO.Socket) => { 
	addEvents(_socket, rdb)
});