import config from '@app/config'
import * as P from 'pino'

const l = P({
  enabled: config.get('general.logs.enabled') === 'true',
  name: config.get('general.logs.app_id'),
  level: config.get('general.logs.level')
})

export default l
