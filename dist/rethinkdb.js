'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rethinkdb = require('rethinkdb');

var r = _interopRequireWildcard(_rethinkdb);

var _rethinkdb2 = require('./configs/rethinkdb.json');

var _rethinkdb3 = _interopRequireDefault(_rethinkdb2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _url = require('url');

var _yargs = require('yargs');

var _dataStore = require('./dataStore');

var _libs = require('./libs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class RethinkDB {
    constructor(_socketIO) {
        this.socketIO = _socketIO;
        this.start();
    }
    start() {
        let _this = this;
        let tempConfig = {
            host: _rethinkdb3.default.host,
            port: _rethinkdb3.default.port,
            db: _rethinkdb3.default.db
        };
        let connect = _config => {
            r.connect(_config, (err, conn) => {
                if (!err) {
                    _this.dbConn = conn;
                    _this.setAllEvents();
                } else {
                    console.log(err);
                }
            });
        };
        let connectWithCert = _cert => {
            let url = new _url.URL(process.env[_rethinkdb3.default.env_url]);
            tempConfig = {
                host: url.hostname,
                port: url.port,
                authKey: url.password,
                ssl: {
                    ca: _cert
                },
                db: _rethinkdb3.default.db
            };
            connect(tempConfig);
        };
        if (_yargs.argv.remoteRDB && !_yargs.argv.rawCert) {
            _fs2.default.readFile(process.env[_rethinkdb3.default.env_cert], (err, caCert) => {
                connectWithCert(caCert);
            });
        } else if (_yargs.argv.remoteRDB && _yargs.argv.rawCert) {
            connectWithCert(process.env[_rethinkdb3.default.env_cert_raw]);
        } else {
            connect(tempConfig);
        }
    }
    setAllEvents() {
        let _this = this;
        r.table('blocks').changes().run(_this.dbConn, function (err, cursor) {
            cursor.each((err, row) => {
                if (!err) _this.onNewBlock(row);
            });
        });
    }

    onNewBlock(_block) {
        let _this = this;
        let txs = _block.new_val.transactions.slice(0);
        _block.new_val.transactions = _block.new_val.transactions.map(function (element) {
            return element.hash;
        });
        this.socketIO.to('blocks').emit('newBlock', (0, _libs.smallBlock)(_block.new_val));
        txs.forEach((tx, idx) => {
            _this.onNewTx(tx);
        });
        (0, _dataStore.addBlock)(_block.new_val.hash, _block.new_val);
    }
    onNewTx(_tx) {
        this.socketIO.to('txs').emit('newTx', (0, _libs.smallTx)(_tx));
        (0, _dataStore.addTx)(_tx.hash, _tx);
    }
}

exports.default = RethinkDB;