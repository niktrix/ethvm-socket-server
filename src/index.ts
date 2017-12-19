import configs from '@/configs'
import * as http from 'http'
import { addTransaction } from '@/dataStore'
import RethinkDB from '@/rethinkConn'
import addEvents from '@/addEvents'

const server:http.Server = http.createServer();

const io = require('socket.io')(server, configs.global.SOCKET_IO);
server.listen(configs.global.SOCKET_IO.port, configs.global.SOCKET_IO.ip, () => {
	console.log("Listening on", configs.global.SOCKET_IO.port)
});
io.on('connection', addEvents);
let rdb = new RethinkDB(io)