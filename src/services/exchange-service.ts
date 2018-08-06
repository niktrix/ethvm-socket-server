export interface ExchangeService {
  getExchangeRate(): Promise<any>
}

export class ExchangeServiceImpl implements ExchangeService {
  public getExchangeRate(): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
