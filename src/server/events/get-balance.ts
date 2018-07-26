import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'
import Ajv from 'ajv'

const ajv = new Ajv();
const schema = {
  "type": "object",
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "address": {
      "$id": "/properties/address",
      "type": "string",
      "title": "The Address Schema ",
      "default": "",
      "examples": [
        "0x0000000000000"
      ]
    }
  }
};
const validate = ajv.compile(schema);


const getBalanceEvent: SocketEvent = {
  name: 'getBalance',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, msg: any, cb: Callback): void => {
    const isValid = validate(msg);
    if (!isValid) {
      cb(validate.errors, null)
    }
    server.vmEngine
      .getBalance(msg)
      .then(result => cb(null, result))
      .catch(error => cb(error, null))
  }
}

export default getBalanceEvent
