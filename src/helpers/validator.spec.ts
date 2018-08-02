import { expect } from 'chai'
import { AddressValidator, DurationValidator, TokensValidator } from './validator'

describe('validator', () => {
  describe('AddressValidator()', () => {
    const msg = { address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D' }
    const wrongMessage = { address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D' }

    it('should validate a correct address', () => {
      const isvalid = AddressValidator(msg)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect address', () => {
      const isvalid = AddressValidator(wrongMessage)
      expect(isvalid).to.be.true
    })
  })

  describe('DurationValidator()', () => {
    const msg = { duration: 'BEGIN' }
    const wrongMessage = { duration: 'WRONG' }

    it('should validate a correct duration', () => {
      const isvalid = DurationValidator(msg)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect duration', () => {
      const isvalid = DurationValidator(wrongMessage)
      expect(isvalid).to.be.false
    })
  })

  describe('TokensValidator()', () => {
    const msg = { tokens: [] }
    const wrongMessage = { tokens: 'WRONG' }

    it('should validate a correct token payload', () => {
      const isvalid = TokensValidator(msg)
      expect(isvalid).to.be.true
    })

    it('should not validate an incorrect token payload', () => {
      const isvalid = TokensValidator(wrongMessage)
      expect(isvalid).to.be.false
    })
  })
})
