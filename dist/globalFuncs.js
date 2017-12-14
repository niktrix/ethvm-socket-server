'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.log = exports.isValidRoom = undefined;

var _validRooms = require('./configs/validRooms');

var _validRooms2 = _interopRequireDefault(_validRooms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let isValidRoom = _rName => {
    return _validRooms2.default.indexOf(_rName) > -1;
};
let log = {
    error: (..._msg) => {
        console.error(_msg.join(' '));
    },
    info: (..._msg) => {
        console.info(_msg.join(' '));
    }
};
exports.isValidRoom = isValidRoom;
exports.log = log;