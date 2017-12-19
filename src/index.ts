import configs from '@/configs'
import * as http from 'http'
import { addTransaction } from '@/dataStore'
import RethinkDB from '@/rethinkConn'
import addEvents from '@/addEvents'
import * as SocketIO from 'socket.io'

const server:http.Server = http.createServer();

const io = require('socket.io')(server, configs.global.SOCKET_IO);
server.listen(configs.global.SOCKET_IO.port, configs.global.SOCKET_IO.ip, () => {
	console.log("Listening on", configs.global.SOCKET_IO.port)
});
let rdb = new RethinkDB(io)
io.on('connection', (_socket: SocketIO.Socket) => { 
	addEvents(_socket, rdb)
});