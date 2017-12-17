import {
    isValidRoom,
    log
} from '@/globalFuncs'
import abc from '@/dataStore'
/*import {
    smallBlock,
    smallTx
} from './libs'
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
        let arr = []
        getBlocks().forEach((_block) => {
            arr.push(smallBlock(_block))
        });
        _socket.emit('newBlock', arr)
    }
}, {
    name: "pastTxs",
    onEvent: (_socket, _msg) => {
        let arr = []
        getTxs().forEach((_tx) => {
            arr.push(smallTx(_tx))
        });
        _socket.emit('newTx', arr)
    }
}]
let onConnection = (_socket) => {
    events.forEach((event, idx) => {
        _socket.on(event.name, (msg) => {
            event.onEvent(_socket, msg)
        })
    })
}

export default onConnection*/

export default {}