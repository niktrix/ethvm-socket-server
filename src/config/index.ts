import * as convict from 'convict'

const config = convict({
  env: {
    default: 'dev',
    format: ['production', 'dev', 'test'],
    env: 'NODE_ENV'
  },

  general: {
    logs: {
      enabled: {
        default: 'true',
        format: String,
        env: 'ETHVM_LOGS_ENABLED'
      },
      app_id: {
        default: 'ethvm-socket',
        format: String,
        env: 'ETHVM_APP_ID'
      },
      level: {
        default: 'debug',
        format: String,
        env: 'ETHVM_LOG_LEVEL'
      }
    }
  },

  server: {
    host: {
      default: '0.0.0.0',
      format: String,
      env: 'ETHVM_SERVER_HOST'
    },
    port: {
      default: 3000,
      format: 'port',
      env: 'ETHVM_SERVER_PORT'
    },
    ping_interval: {
      default: 10000,
      format: 'duration',
      env: 'ETHVM_SERVER_PING_INTERVAL'
    },
    ping_timeout: {
      default: 5000,
      format: 'duration',
      env: 'ETHVM_PING_TIMEOUT'
    }
  },

  data_stores: {
    provider: {
      default: 'redis',
      format: ['redis', 'loki'],
      env: 'ETHVM_DATASTORE_PROVIDER'
    },

    redis: {
      url: {
        default: 'redis://localhost:6379',
        format: String,
        env: 'ETHVM_REDIS_URL'
      },
      socket_rows: {
        default: 64,
        format: 'int',
        env: 'ETHVM_REDIS_SOCKET_ROWS'
      }
    },

    loki: {
      db_name: {
        default: 'loki.json',
        format: String,
        env: 'ETHVM_LOKI_DB_NAME'
      },
      ttl: {
        interval: {
          default: 5000, // 5 secs,
          format: 'duration',
          env: 'ETHVM_LOKI_TTL_INTERVAL'
        },
        age: {
          default: 5 * 60 * 1000, // 5 mins
          format: 'duration',
          env: 'ETHVM_LOKI_TTL_AGE'
        }
      }
    }
  },

  rethink_db: {
    db_name: {
      default: 'eth_mainnet',
      format: String,
      env: 'ETHVM_RETHINK_DB_NAME'
    },
    host: {
      default: 'localhost',
      format: String,
      env: 'ETHVM_RETHINK_DB_HOST'
    },
    port: {
      default: 28015,
      format: 'port',
      env: 'ETHVM_RETHINK_DB_PORT'
    },
    user: {
      default: 'admin',
      format: String,
      env: 'ETHVM_RETHINK_DB_USER'
    },
    password: {
      default: '',
      format: String,
      env: 'ETHVM_RETHINK_DB_PASSWORD',
      sensitive: true
    },
    cert_raw: {
      default: '',
      format: String,
      env: 'ETHVM_RETHINK_DB_CERT_RAW',
      sensitive: true
    }
  },

  eth: {
    rpc: {
      host: {
        default: 'localhost',
        format: String,
        env: 'ETHVM_ETH_RPC_HOST'
      },
      port: {
        default: 8545,
        format: 'port',
        env: 'ETHVM_RPC_ETH_PORT'
      }
    },
    block_time: {
      default: '14 seconds',
      format: 'duration',
      env: 'ETHVM_ETH_BLOCK_TIME'
    },
    state_root: {
      default: 'd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544',
      format: String,
      env: 'ETHVM_ETH_STATE_ROOT'
    },
    vm: {
      engine: {
        rpc_url: {
          default: 'https://api.myetherwallet.com/eth',
          format: String,
          env: 'ETHVM_ETH_VM_ENGINE_RPC_URL'
        },
        tokens_smart_contract: {
          address: {
            default: '0xbe1ecf8e340f13071761e0eef054d9a511e1cb56',
            format: String,
            env: 'ETHVM_ETH_VM_ENGINE_TOKENS_SMART_CONTRACT_ADDRESS'
          }
        },
        gas_limit: {
          default: '0x4c4b40', // 50000000
          format: String,
          env: 'ETHVM_ETH_VM_ENGINE_GAS_LIMIT'
        }
      }
    }
  }
})

const env = config.get('env')
const configFilePath = process.env.ETHVM_CONFIG_FILE ? process.env.ETHVM_CONFIG_FILE : `${__dirname}/${env}.config.json`

config.loadFile(configFilePath)
config.validate({ allowed: 'strict' })

export default config
