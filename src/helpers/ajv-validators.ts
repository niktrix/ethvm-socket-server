import { isBuffer, isValidHash } from '@app/helpers'
import * as Ajv from 'ajv'
import { isValidAddress } from 'ethereumjs-util'

// Define some constants
const PAGINATION_SIZE = 25
const ROOMS = ['blocks', 'txs', 'uncles']
const PERIODS = ['ALL', 'YEAR', 'MONTH', 'DAY']

// Create Ajv
const ajv = new Ajv()
require('ajv-keywords')(ajv, ['instanceof']) // tslint:disable-line no-var-requires

// Create custom data types
ajv.addKeyword('address', {
  validate: (schema, data) => isValidAddress(data),
  errors: false
})

ajv.addKeyword('addresBuffer', {
  validate: (schema, data) => isBuffer(data, 20),
  errors: false
})

ajv.addKeyword('hash', {
  validate: (schema, data) => isValidHash(data),
  errors: false
})

ajv.addKeyword('hashBuffer', {
  validate: (schema, data) => isBuffer(data, 32),
  errors: false
})

// Mini schemas definitions
const addressBufferSchema = {
  $id: '/properties/address',
  instanceof: 'Buffer',
  addresBuffer: true
}

const addressSchema = {
  $id: '/properties/address',
  type: 'string',
  address: true
}

const hashBufferSchema = {
  $id: '/properties/hash',
  instanceof: 'Buffer',
  hashBuffer: true
}

const limitSchema = {
  $id: '/properties/limit',
  type: 'number',
  default: PAGINATION_SIZE
}

const pageSchema = {
  $id: '/properties/limit',
  type: 'number',
  default: 0
}

// Schemas definitions
const AddressTxsPagesPayloadSchema = {
  $id: 'https://ethvm.com/address.txs.pages.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressBufferSchema,
    hash: hashBufferSchema,
    number: {
      $id: '/properties/number',
      type: 'number'
    }
  },
  required: ['address', 'number'],
  additionalProperties: false
}

const JoinLeavePayloadSchema = {
  $id: 'https://ethvm.com/join.leave.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    rooms: {
      $id: '/properties/rooms',
      type: 'array',
      additionalItems: { type: 'string' },
      uniqueItems: true,
      enum: ROOMS,
      minItems: 1,
      maxItems: ROOMS.length
    }
  },
  required: ['rooms'],
  additionalProperties: false
}

const BalancePayloadSchema = {
  $id: 'https://ethvm.com/balance.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema
  },
  required: ['address'],
  additionalProperties: false
}

const BlockTxsPayloadSchema = {
  $id: 'https://ethvm.com/block.txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema
  },
  required: ['address'],
  additionalProperties: false
}

const BlockPayloadSchema = {
  $id: 'https://ethvm.com/block.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema
  },
  required: ['address'],
  additionalProperties: false
}

const ChartPayloadSchema = {
  $id: 'https://ethvm.com/chart.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    duration: {
      $id: '/properties/duration',
      type: 'string',
      enum: PERIODS
    }
  },
  required: ['duration'],
  additionalProperties: false
}

const EthCallPayloadSchema = {
  $id: 'https://ethvm.com/eth.call.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: [],
  additionalProperties: false
}

const TokensBalancePayloadSchema = {
  $id: 'https://ethvm.com/tokens.balance.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema
  },
  required: ['address'],
  additionalProperties: false
}

const TokensPayloadSchema = {
  $id: 'https://ethvm.com/tokens.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    tokens: {
      $id: '/properties/tokens',
      type: 'array'
    }
  },
  required: ['tokens'],
  additionalProperties: false
}

const TotalTxsPayloadSchema = {
  $id: 'https://ethvm.com/total.txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema
  },
  required: ['address'],
  additionalProperties: false
}

const TxPayloadSchema = {
  $id: 'https://ethvm.com/tx.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    hash: hashBufferSchema
  },
  required: ['hash'],
  additionalProperties: false
}

const TxsPayloadSchema = {
  $id: 'https://ethvm.com/txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: addressSchema,
    limit: limitSchema,
    page: pageSchema
  },
  required: ['address'],
  additionalProperties: false
}

const TxsPagesPayloadSchema = {
  $id: 'https://ethvm.com/txs.pages.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    hash: hashBufferSchema,
    number: {
      $id: '/properties/number',
      type: 'number'
    }
  },
  required: ['number'],
  additionalProperties: false
}

// Compile schemas
const ethCallPayloadValidator = ajv.compile(EthCallPayloadSchema)
const addressTxsPagesPayloadValidator = ajv.compile(AddressTxsPagesPayloadSchema)
const balancePayloadValidator = ajv.compile(BalancePayloadSchema)
const blockTxsPayloadValidator = ajv.compile(BlockTxsPayloadSchema)
const blockPayloadValidator = ajv.compile(BlockPayloadSchema)
const chartPayloadValidator = ajv.compile(ChartPayloadSchema)
const joinLeavePayloadValidator = ajv.compile(JoinLeavePayloadSchema)
const tokensPayloadValidator = ajv.compile(TokensPayloadSchema)
const tokensBalancePayloadValidator = ajv.compile(TokensBalancePayloadSchema)
const txPayloadValidator = ajv.compile(TxPayloadSchema)
const txsPayloadValidator = ajv.compile(TxsPayloadSchema)
const txsPagesPayloadValidator = ajv.compile(TxsPagesPayloadSchema)
const totalTxsPayloadValidator = ajv.compile(TotalTxsPayloadSchema)

export {
  addressTxsPagesPayloadValidator,
  balancePayloadValidator,
  blockTxsPayloadValidator,
  blockPayloadValidator,
  chartPayloadValidator,
  ethCallPayloadValidator,
  joinLeavePayloadValidator,
  tokensPayloadValidator,
  tokensBalancePayloadValidator,
  txPayloadValidator,
  txsPayloadValidator,
  txsPagesPayloadValidator,
  totalTxsPayloadValidator
}
