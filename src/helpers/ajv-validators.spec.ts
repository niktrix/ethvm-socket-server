import { expect } from 'chai'
import { validators } from './ajv-validators'

describe('ajv-validators', () => {
  describe('address validator', () => {
    it('should validate a correct address', () => {
      const payload = { address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D' }
      const isvalid = validators.addressValidator(payload)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect address', () => {
      const inputs = ['', '0x', '0x0', 10]
      inputs.forEach(input => {
        const payload = { address: input }
        const isvalid = validators.addressValidator(payload)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('duration validator', () => {
    it('should validate a correct duration', () => {
      const inputs = ['ALL', 'YEAR', 'MONTH', 'DAY']
      inputs.forEach(input => {
        const msg = { duration: input }
        const isvalid = validators.durationValidator(msg)
        expect(isvalid).to.be.true
      })
    })

    it('should not validate an incorrect duration', () => {
      const inputs = ['', 'WRONG', 'year', 6]
      inputs.forEach(input => {
        const msg = { duration: input }
        const isvalid = validators.durationValidator(msg)
        expect(isvalid).to.be.false
      })
    })
  })

  describe('tokens validator', () => {
    it('should validate a correct token payload', () => {
      const msg = { tokens: [] }
      const isvalid = validators.tokensValidator(msg)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect token payload', () => {
      const wrongMessage = { tokens: 'WRONG' }
      const isvalid = validators.tokensValidator(wrongMessage)
      expect(isvalid).to.be.false
    })
  })
})
