'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _globalFuncs = require('./globalFuncs');

var _dataStore = require('./dataStore');

var _libs = require('./libs');

let events = [{
    name: "join",
    onEvent: (_socket, _msg) => {
        if ((0, _globalFuncs.isValidRoom)(_msg)) {
            _socket.join(_msg);
            _globalFuncs.log.info(_socket.id, "joined", _msg);
        } else {
            _globalFuncs.log.error(_socket.id, 'tried to join invalid room', _msg);
        }
    }
}, {
    name: "pastBlocks",
    onEvent: (_socket, _msg) => {
        let arr = [];
        (0, _dataStore.getBlocks)().forEach(_block => {
            arr.push((0, _libs.smallBlock)(_block));
        });
        _socket.emit('newBlock', arr);
    }
}, {
    name: "pastTxs",
    onEvent: (_socket, _msg) => {
        let arr = [];
        (0, _dataStore.getTxs)().forEach(_tx => {
            arr.push((0, _libs.smallTx)(_tx));
        });
        _socket.emit('newTx', arr);
    }
}];
let onConnection = _socket => {
    events.forEach((event, idx) => {
        _socket.on(event.name, msg => {
            event.onEvent(_socket, msg);
        });
    });
};

exports.default = onConnection;