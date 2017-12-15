import socketConf from './configs/socketio'
import http from 'http'
import addEvents from './addEvents'
import RethinkDB from './rethinkdb'
import {
    loadLRUFromFile,
    saveLRUToFile
} from './dataStore'
const server = http.createServer();

const io = require('socket.io')(server, socketConf);
server.listen(process.env.PORT || socketConf.port, socketConf.ip, () => {
    console.log("Listening on", socketConf.port)
});
loadLRUFromFile()
io.on('connection', addEvents);
let rdb = new RethinkDB(io)
setInterval(saveLRUToFile, 10000)