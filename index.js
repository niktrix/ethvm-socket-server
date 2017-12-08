import socketConf from './configs/socketio'
import http from 'http'
import addEvents from './addEvents'
import RethinkDB from './rethinkdb'
const server = http.createServer();

const io = require('socket.io')(server, socketConf);
server.listen(socketConf.port, () => {
    console.log("Listening on", socketConf.port)
});
io.on('connection', addEvents);
let rdb = new RethinkDB(io)