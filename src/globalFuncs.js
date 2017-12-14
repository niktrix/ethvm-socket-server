import validRooms from './configs/validRooms'

let isValidRoom = (_rName) => {
    return validRooms.indexOf(_rName) > -1
}
let log = {
    error: (..._msg) => {
        console.error(_msg.join(' '))
    },
    info: (..._msg) => {
        console.info(_msg.join(' '))
    }
}
export {
    isValidRoom,
    log
}