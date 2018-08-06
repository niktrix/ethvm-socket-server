import { eth } from '@app/helpers'
import * as Ajv from 'ajv'
import { isValidAddress } from 'ethereumjs-util'

const ajv = new Ajv()

// Create custom data types
ajv.addKeyword('address', {
  validate: (schema, data) => isValidAddress(data),
  errors: false
})

ajv.addKeyword('addresBuffer', {
  validate: (schema, data) => eth.isBufferObject(data, 20),
  errors: false
})

ajv.addKeyword('hash', {
  validate: (schema, data) => eth.isValidHash(data),
  errors: false
})

ajv.addKeyword('hashBuffer', {
  validate: (schema, data) => eth.isBufferObject(data, 32),
  errors: false
})

// Types Schemas Definitions

// Schemas definitions
const EthCallPayloadSchema = {
  $id: 'https://ethvm.com/eth.call.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: []
}

const AddressTxsPagesPayloadSchema = {
  $id: 'https://ethvm.com/address.txs.pages.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: []
}

const BalancePayloadSchema = {
  $id: 'https://ethvm.com/balance.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: []
}

const BlockTxsPayloadSchema = {
  $id: 'https://ethvm.com/block.txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: []
}

const BlockPayloadSchema = {
  $id: 'https://ethvm.com/block.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: []
}

const ChartPayloadSchema = {
  $id: 'https://ethvm.com/chart.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: []
}

const JoinPayloadSchema = {
  $id: 'https://ethvm.com/join.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: []
}

const LeavePayloadSchema = {
  $id: 'https://ethvm.com/leave.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: []
}

const PastBlocksPayloadSchema = {
  $id: 'https://ethvm.com/past.blocks.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: []
}

const PastTxsPayloadSchema = {
  $id: 'https://ethvm.com/past.txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: []
}

const TxsPayloadSchema = {
  $id: 'https://ethvm.com/txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: []
}

// To be deprecated
const AddressSchema = {
  $id: 'https://ethvm.com/address.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: {
      $id: '/properties/address',
      type: 'string',
      address: true
    }
  },
  required: ['address']
}

const DurationSchema = {
  $id: 'https://ethvm.com/duration.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    duration: {
      $id: '/properties/duration',
      type: 'string',
      enum: ['ALL', 'YEAR', 'MONTH', 'DAY'],
      default: ''
    }
  },
  required: ['duration']
}

const TokenSchema = {
  $id: 'https://ethvm.com/token.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    tokens: {
      $id: '/properties/tokens',
      type: 'array'
    }
  }
}

// Compile schemas
const ethCallPayloadValidator = ajv.compile(EthCallPayloadSchema)
const addressTxsPagesPayloadValidator = ajv.compile(AddressTxsPagesPayloadSchema)
const balancePayloadValidator = ajv.compile(BalancePayloadSchema)
const blockTxsPayloadValidator = ajv.compile(BlockTxsPayloadSchema)
const blockPayloadValidator = ajv.compile(BlockPayloadSchema)
const chartPayloadValidator = ajv.compile(ChartPayloadSchema)
const joinPayloadValidator = ajv.compile(JoinPayloadSchema)
const leavePayloadValidator = ajv.compile(LeavePayloadSchema)
const pastBlocksPayloadValidator = ajv.compile(PastBlocksPayloadSchema)
const pastTxsBlocksPayloadValidator = ajv.compile(PastTxsPayloadSchema)
const txsPayloadValidator = ajv.compile(TxsPayloadSchema)

const validators = {
  ethCallPayloadValidator,
  addressTxsPagesPayloadValidator,
  balancePayloadValidator,
  blockTxsPayloadValidator,
  blockPayloadValidator,
  chartPayloadValidator,
  joinPayloadValidator,
  leavePayloadValidator,
  pastBlocksPayloadValidator,
  pastTxsBlocksPayloadValidator,
  txsPayloadValidator
}

export { validators }
