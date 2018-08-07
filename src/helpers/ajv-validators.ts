import { isBuffer, isValidHash } from '@app/helpers'
import * as Ajv from 'ajv'
import { isValidAddress } from 'ethereumjs-util'

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

// Types Schemas Definitions

// Schemas definitions
const AddressTxsPagesPayloadSchema = {
  $id: 'https://ethvm.com/address.txs.pages.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: {
      $id: '/properties/address',
      instanceof: 'Buffer',
      addresBuffer: true
    },
    number: {
      $id: '/properties/number',
      type: 'number'
    },
    hash: {
      $id: '/properties/hash',
      instanceof: 'Buffer',
      hashBuffer: true
    }
  },
  required: ['address', 'number', 'hash']
}

const BalancePayloadSchema = {
  $id: 'https://ethvm.com/balance.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: {
      $id: '/properties/address',
      type: 'string',
      address: true
    }
  },
  required: ['address'],
  additionalProperties: false
}

const BlockTxsPayloadSchema = {
  $id: 'https://ethvm.com/block.txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: {
      $id: '/properties/address',
      type: 'string',
      address: true
    }
  },
  required: ['address'],
  additionalProperties: false
}

const BlockPayloadSchema = {
  $id: 'https://ethvm.com/block.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: {
      $id: '/properties/address',
      type: 'string',
      address: true
    }
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
      enum: ['ALL', 'YEAR', 'MONTH', 'DAY'],
      default: ''
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

const JoinPayloadSchema = {
  $id: 'https://ethvm.com/join.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: [],
  additionalProperties: false
}

const LeavePayloadSchema = {
  $id: 'https://ethvm.com/leave.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: [],
  additionalProperties: false
}

const PastBlocksPayloadSchema = {
  $id: 'https://ethvm.com/past.blocks.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: [],
  additionalProperties: false
}

const PastTxsPayloadSchema = {
  $id: 'https://ethvm.com/past.txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {},
  required: [],
  additionalProperties: false
}

const TokensBalancePayloadSchema = {
  $id: 'https://ethvm.com/past.txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: {
      $id: '/properties/address',
      type: 'string',
      address: true
    }
  },
  required: ['address'],
  additionalProperties: false
}

const TokensPayloadSchema = {
  $id: 'https://ethvm.com/txs.payload.schema.json',
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
  $id: 'https://ethvm.com/past.txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    address: {
      $id: '/properties/address',
      type: 'string',
      address: true
    }
  },
  required: ['address'],
  additionalProperties: false
}

const TxsPayloadSchema = {
  $id: 'https://ethvm.com/txs.payload.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    duration: {
      $id: '/properties/duration',
      type: 'string',
      enum: ['ALL', 'YEAR', 'MONTH', 'DAY'],
      default: ''
    },
    tokens: {
      $id: '/properties/tokens',
      type: 'array'
    }
  },
  required: [],
  additionalProperties: false
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
const totalTxsPayloadValidator = ajv.compile(TotalTxsPayloadSchema)

const validators = {
  addressTxsPagesPayloadValidator,
  balancePayloadValidator,
  blockTxsPayloadValidator,
  blockPayloadValidator,
  chartPayloadValidator,
  ethCallPayloadValidator,
  joinPayloadValidator,
  leavePayloadValidator,
  pastBlocksPayloadValidator,
  pastTxsBlocksPayloadValidator,
  txsPayloadValidator,
  totalTxsPayloadValidator
}

export { validators }
