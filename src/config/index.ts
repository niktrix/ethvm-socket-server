import * as convict from 'convict'

const config = convict({
  env: {
    default: 'dev',
    format: ['prod', 'dev', 'test'],
    env: 'NODE_ENV'
  },

  eth_vm_server: {
    socket_io: {
      host: {
        default: '0.0.0.0',
        format: String,
        env: 'ETHVM_HOST'
      },
      port: {
        default: 3000,
        format: 'port',
        env: 'ETHVM_PORT'
      },
      ping_interval: {
        default: 10000,
        format: 'duration',
        env: 'ETHVM_SOCKETIO_PING_INTERVAL'
      },
      ping_timeout: {
        default: 5000,
        format: 'duration',
        env: 'ETHVM_SOCKETIO_PING_TIMEOUT'
      }
    },

    general: {
      block_time: {
        default: '14 seconds',
        format: 'duration',
        env: 'ETHVM_BLOCK_TIME'
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
      },

      rethink_db: {
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
        db_name: {
          default: 'eth_mainnet',
          format: String,
          env: 'ETHVM_RETHINK_DB_NAME'
        },
        cert_raw: {
          default: '',
          format: String,
          env: 'ETHVM_RETHINK_DB_CERT_RAW',
          sensitive: true
        }
      }
    },

    geth: {
      host: {
        default: 'localhost',
        format: String,
        env: 'ETHVM_GETH_HOST'
      },
      port: {
        default: 8545,
        format: 'port',
        env: 'ETHVM_GETH_PORT'
      }
    }
  }
})

const env = config.get('env')

config.loadFile(`${__dirname}/${env}.config.json`)
config.validate({ allowed: 'strict' })

export default config
