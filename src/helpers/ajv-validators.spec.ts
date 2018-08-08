import {
  addressTxsPagesPayloadValidator,
  balancePayloadValidator,
  blockPayloadValidator,
  blockTxsPayloadValidator,
  chartPayloadValidator,
  hexToBuffer,
  tokensBalancePayloadValidator,
  totalTxsPayloadValidator,
  txPayloadValidator,
  txsPagesPayloadValidator,
  txsPayloadValidator
} from '@app/helpers'
import { expect } from 'chai'
import { joinLeavePayloadValidator } from './ajv-validators'

describe('ajv-validators', () => {
  describe('addressTxsPagesPayloadValidator', () => {
    it('should validate a correct address txs pages payload', () => {
      const payload = {
        address: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'),
        number: 1,
        hash: hexToBuffer('0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238')
      }
      const isvalid = addressTxsPagesPayloadValidator(payload)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect address txs pages payloads', () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          number: '1',
          hash: hexToBuffer('')
        },
        {
          address: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D434p[ '),
          number: 1
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = addressTxsPagesPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('balancePayloadValidator', () => {
    it('should validate a correct balance payload', () => {
      const payload = {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
      const isvalid = balancePayloadValidator(payload)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect balance payloads', () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          number: '1'
        },
        {
          address: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'),
          number: 1
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = balancePayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('blockTxsPayloadValidator', () => {
    it('should validate a correct block txs payload', () => {
      const payload = {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
      const isvalid = blockTxsPayloadValidator(payload)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect block txs payloads', () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          number: '1'
        },
        {
          address: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'),
          number: 1
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = blockTxsPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('blockPayloadValidator', () => {
    it('should validate a correct block payload', () => {
      const payload = {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
      const isvalid = blockPayloadValidator(payload)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect block payloads', () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          number: '1'
        },
        {
          address: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'),
          number: 1
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = blockPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('chartPayloadValidator', () => {
    it('should validate a correct chart payload', () => {
      const inputs = [
        {
          duration: 'ALL'
        },
        {
          duration: 'YEAR'
        },
        {
          duration: 'MONTH'
        },
        {
          duration: 'DAY'
        }
      ]
      inputs.forEach(input => {
        const isvalid = chartPayloadValidator(input)
        expect(isvalid).to.be.true
      })
    })

    it('should not validate an incorrect chart payloads', () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          number: '1'
        },
        {
          address: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'),
          number: 1
        },
        {
          duration: ''
        },
        {
          duration: 'all'
        },
        {
          duration: []
        },
        {
          duration: ['ALL', 'YEAR']
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = chartPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('tokensBalancePayloadValidator', () => {
    it('should validate a correct tokens balance payload', () => {
      const payload = {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
      const isvalid = tokensBalancePayloadValidator(payload)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect tokens balance payloads', () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          number: '1'
        },
        {
          address: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'),
          number: 1
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = tokensBalancePayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('totalTxsPayloadValidator', () => {
    it('should validate a correct total txs payload', () => {
      const payload = {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
      const isvalid = totalTxsPayloadValidator(payload)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect tokens balance payloads', () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          number: '1'
        },
        {
          address: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'),
          number: 1
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = totalTxsPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('txPayloadValidator', () => {
    it('should validate a correct tx payload', () => {
      const payload = {
        hash: hexToBuffer('0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238')
      }
      const isvalid = txPayloadValidator(payload)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect tx payloads', () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          hash: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          hash: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          number: '1'
        },
        {
          hash: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'),
          number: 1
        },
        {
          hash: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D')
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = txPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('txsPagesPayloadValidator', () => {
    it('should validate a correct txs pages payload', () => {
      const inputs = [
        {
          number: 1,
          hash: hexToBuffer('0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238')
        },
        {
          number: 1
        }
      ]
      inputs.forEach(input => {
        const isvalid = txsPagesPayloadValidator(input)
        expect(isvalid).to.be.true
      })
    })

    it('should not validate an incorrect txs pages payloads', () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          hash: '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238'
        },
        {
          hash: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          number: '1'
        },
        {
          hash: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'),
          number: 1
        },
        {
          hash: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D')
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = txsPagesPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('txsPayloadValidator', () => {
    it('should validate a correct txs payload', () => {
      const inputs = [
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          limit: 10
        },
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          limit: 10,
          page: 1
        }
      ]
      inputs.forEach(input => {
        const isvalid = txsPayloadValidator(input)
        expect(isvalid).to.be.true
      })
    })

    it('should not validate an incorrect txs payloads', () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          address: '0xb903239f8543d04b5dc1ba65'
        },
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          number: '1'
        },
        {
          address: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D')
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = txsPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  xdescribe('join / leave validator', () => {
    it('should validate a correct join/leave payload', () => {
      const inputs = [
        {
          rooms: ['blocks']
        },
        {
          rooms: ['blocks', 'txs']
        },
        {
          rooms: ['blocks', 'txs', 'uncles']
        }
      ]
      inputs.forEach(input => {
        const isvalid = joinLeavePayloadValidator(input)
        expect(isvalid).to.be.true
      })
    })

    it('should not validate an incorrect join/leave payloads', () => {
      const inputs = [
        '',
        '0x',
        '0x0',
        10,
        {},
        {
          rooms: []
        },
        {
          rooms: ['blocks', 'txs', 'uncles', 'invalid']
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = joinLeavePayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })
})
