import * as Ajv from 'ajv'

const ajv = new Ajv()

const addressSchema = {
  type: 'object',
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    address: {
      $id: '/properties/address',
      type: 'string',
      title: 'The Address Schema ',
      default: '',
      examples: ['0x0000000000000']
    }
  }
}

const durationSchema = {
  type: 'object',
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    duration: {
      $id: '/properties/duration',
      type: 'string',
      enum: ["BEGIN","YEAR","MONTH","DAY"],
      title: 'The Duration Schema ',
      default: '',
    }
  }
}
const AddressValidator = ajv.compile(addressSchema)
const DurationValidator = ajv.compile(durationSchema)

export { AddressValidator, DurationValidator}
