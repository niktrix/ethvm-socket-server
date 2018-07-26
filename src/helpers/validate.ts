import * as Ajv from 'ajv'

const ajv = new Ajv();
const addressSchema = {
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
const AddressValidator = ajv.compile(addressSchema);
export {AddressValidator}

