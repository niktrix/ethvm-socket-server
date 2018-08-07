import { VmEngine, VmRunner } from '@app/vm'

export interface VmService {
  getBalance(args: any): Promise<any>
  getAccount(): Promise<any>
  getAllTokens(args: any): Promise<any>
  getCurrentStateRoot(): Promise<Buffer>
  call(args: any): Promise<any>
}

export class VmServiceImpl implements VmService {
  constructor(private readonly engine: VmEngine, private readonly runner: VmRunner) {}

  public getBalance(args: any): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public getAccount(): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public getAllTokens(args: any): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public getCurrentStateRoot(): Promise<Buffer> {
    throw new Error('Method not implemented.')
  }

  public call(args: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
