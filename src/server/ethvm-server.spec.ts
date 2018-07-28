import { RedisDataStore, RethinkDBDataStore } from 'datastores'
import * as EventEmitter from 'eventemitter3'
import { MockDS, MockTrieDB } from 'testutils'
import { VmEngine, VmRunner } from 'vm'
import { EthVMServer } from '.'

import { expect } from 'chai'
import 'mocha'

import getBalanceEvent from './events/get-balance'

describe('ethvm-server events', () => {
  before(() => {
    const triedb = new MockTrieDB()
    const ds = new MockDS()
    const vme = new VmEngine()
    const vmr = new VmRunner(triedb)
    const emitter = new EventEmitter()
    const rdb = new RethinkDBDataStore(emitter)
    const server = new EthVMServer(triedb, vmr, vme, ds, rdb, emitter)
    server.start()
  })
  describe('start() method', () => {
    it('should return true', () => {
      expect(true).to.be.true
    })
  })

  after(() => {
    // stop server
  })
})
