import { hexToBuffer, validators } from '@app/helpers'
import { expect } from 'chai'

describe('ajv-validators', () => {
  describe('address txs pages validator', () => {
    it('should validate a correct payload', () => {
      const payload = {
        address: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'),
        number: 1,
        hash: hexToBuffer('0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238')
      }
      const isvalid = validators.addressTxsPagesPayloadValidator(payload)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect address payloads', () => {
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
          address: hexToBuffer('0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'),
          number: 1
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = validators.addressTxsPagesPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('balance validator', () => {
    it('should validate a correct balance payload', () => {
      const payload = {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
      const isvalid = validators.balancePayloadValidator(payload)
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
        const isvalid = validators.balancePayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('block txs validator', () => {
    it('should validate a correct block txs payload', () => {
      const payload = {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
      const isvalid = validators.blockTxsPayloadValidator(payload)
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
        const isvalid = validators.blockTxsPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('block validator', () => {
    it('should validate a correct block payload', () => {
      const payload = {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
      const isvalid = validators.blockPayloadValidator(payload)
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
        const isvalid = validators.blockPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('chart validator', () => {
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
        const isvalid = validators.chartPayloadValidator(input)
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
        }
      ]
      inputs.forEach(input => {
        const payload = input
        const isvalid = validators.chartPayloadValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })
})
