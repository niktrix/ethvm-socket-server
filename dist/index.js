'use strict';

var _socketio = require('./configs/socketio');

var _socketio2 = _interopRequireDefault(_socketio);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _addEvents = require('./addEvents');

var _addEvents2 = _interopRequireDefault(_addEvents);

var _rethinkdb = require('./rethinkdb');

var _rethinkdb2 = _interopRequireDefault(_rethinkdb);

var _dataStore = require('./dataStore');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const server = _http2.default.createServer();

const io = require('socket.io')(server, _socketio2.default);
server.listen(process.env.PORT || _socketio2.default.port, _socketio2.default.ip, () => {
    console.log("Listening on", _socketio2.default.port);
});
(0, _dataStore.loadLRUFromFile)();
io.on('connection', _addEvents2.default);
let rdb = new _rethinkdb2.default(io);
setInterval(_dataStore.saveLRUToFile, 10000);