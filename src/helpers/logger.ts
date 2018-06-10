import * as P from 'pino'

const l = P({
  name: process.env.ETHVM_APP_ID || 'ethvm-server',
  level: process.env.ETHVM_LOG_LEVEL || 'debug',
  enabled: process.env.ETHVM_LOGS_ENABLED === 'true' || true
})

export default l
