import {
    isValidRoom,
    log
} from './globalFuncs'
import {
    getBlocks,
    getTxs
} from './dataStore'
let events = [{
    name: "join",
    onEvent: (_socket, _msg) => {
        if (isValidRoom(_msg)) {
            _socket.join(_msg)
            log.info(_socket.id, "joined", _msg)
        } else {
            log.error(_socket.id, 'tried to join invalid room', _msg)
        }
    }
}, {
    name: "pastBlocks",
    onEvent: (_socket, _msg) => {
        getBlocks().forEach((_block) => {
            _socket.emit('newBlock', _block)
        });
    }
}, {
    name: "pastTxs",
    onEvent: (_socket, _msg) => {
        getTxs().forEach((_tx) => {
            _socket.emit('newTx', _tx)
        });
    }
}]
let onConnection = (_socket) => {
    events.forEach((event, idx) => {
        _socket.on(event.name, (msg) => {
            event.onEvent(_socket, msg)
        })
    })
}

export default onConnection