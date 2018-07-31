import { expect } from 'chai'
import { AddressValidator, DurationValidator, TokensValidator } from './validator'

describe('validate', () => {
  describe('AddressValidator() method', () => {
    const msg = { address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D' }
    const wrongmessage = { address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D' }

    it('should return true', () => {
      const isvalid = AddressValidator(msg)
      expect(isvalid).to.be.true
    })

    it('should return false', () => {
      const isvalid = AddressValidator(wrongmessage)
      expect(isvalid).to.be.true
    })
  })

  describe('DurationValidator() method', () => {
    const msg = { duration: 'BEGIN' }
    const wrongmessage = { duration: 'WRONG' }

    it('should return true', () => {
      const isvalid = DurationValidator(msg)
      expect(isvalid).to.be.true
    })

    it('should return false', () => {
      const isvalid = DurationValidator(wrongmessage)
      expect(isvalid).to.be.false
    })
  })

  describe('TokensValidator() method', () => {
    const msg = { tokens: [] }
    const wrongmessage = { tokens: 'WRONG' }

    it('should return true', () => {
      const isvalid = TokensValidator(msg)
      expect(isvalid).to.be.true
    })

    it('should return false', () => {
      const isvalid = TokensValidator(wrongmessage)
      expect(isvalid).to.be.false
    })
  })
})
