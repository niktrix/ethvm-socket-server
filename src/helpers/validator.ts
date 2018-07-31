import * as Ajv from 'ajv'
import { isValidAddress } from 'ethereumjs-util'

const ajv = new Ajv()
ajv.addKeyword('address', {
  validate: (schema, data) => isValidAddress(data),
  errors: false
})

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
      address: true,
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
      enum: ['BEGIN', 'YEAR', 'MONTH', 'DAY'],
      title: 'The Duration Schema ',
      default: ''
    }
  }
}

const tokenSchema = {
  type: 'object',
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    tokens: {
      $id: '/properties/tokens',
      type: 'array'
    }
  }
}

const AddressValidator = ajv.compile(addressSchema)
const DurationValidator = ajv.compile(durationSchema)
const TokensValidator = ajv.compile(tokenSchema)

export { AddressValidator, DurationValidator, TokensValidator }
