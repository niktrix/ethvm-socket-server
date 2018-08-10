import { VmEngine, VmRunner } from '@app/server/modules/vm'

export interface VmService {
  setStateRoot(): Promise<boolean>
  getAccount(): Promise<any>
  getCurrentStateRoot(): Promise<Buffer>
  getBalance(address: string): Promise<any>
  getTokensBalance(address: string): Promise<any>
  call(args: any): Promise<any>
}

export class VmServiceImpl implements VmService {
  constructor(private readonly engine: VmEngine, private readonly runner: VmRunner) {}

  setStateRoot(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  public getAccount(): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public getCurrentStateRoot(): Promise<Buffer> {
    throw new Error('Method not implemented.')
  }

  public getBalance(address: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public getTokensBalance(address: string): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public call(args: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
