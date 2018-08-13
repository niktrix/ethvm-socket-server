import { BaseRethinkDbRepository, RethinkEthVM } from '@app/server/datastores'
import r from 'rethinkdb'

export class ChartsRepository extends BaseRethinkDbRepository {
  public getBlockSize(start: Date, end: Date): Promise<number> {
    return r
      .table(RethinkEthVM.tables.blocks_metrics)
      .between(r.epochTime(start.getTime() / 1000), r.epochTime(end.getTime() / 1000), {
        index: 'timestamp',
        rightBound: 'closed'
      })
      .group(r.row('timestamp').date())
      .avg(r.row('size'))
      .run(this.conn)
      .then((cursor: r.CursorResult<number>) => cursor.toArray())
  }

  public getAccountsGrowth(start: Date, end: Date): Promise<any> {
    return r
      .table(RethinkEthVM.tables.blocks_metrics)
      .between(r.epochTime(start.getTime() / 1000), r.epochTime(end.getTime() / 1000), {
        index: 'timestamp',
        rightBound: 'closed'
      })
      .group(r.row('timestamp').date())
      .map(r.row('accounts').count())
      .reduce((lf, rt) => lf.add(rt))
      .default(0)
      .run(this.conn)
      .then((cursor: r.cursor) => cursor.toArray())
  }

  public getAvTxFee(start: Date, end: Date): Promise<any> {
    return r
      .table(RethinkEthVM.tables.blocks_metrics)
      .between(r.epochTime(start.getTime()), r.epochTime(end.getTime()), {
        index: 'timestamp',
        rightBound: 'closed'
      })
      .group(r.row('timestamp').date())
      .avg(r.row('txFees'))
      .run(this.conn)
      .then((cursor: r.cursor) => cursor.toArray())
  }

  public getGasLimit(start: Date, end: Date): Promise<number> {
    return r
      .table(RethinkEthVM.tables.blocks_metrics)
      .between(r.epochTime(start.getTime() / 1000), r.epochTime(end.getTime() / 1000), {
        index: 'timestamp',
        rightBound: 'closed'
      })
      .group(r.row('timestamp').date())
      .avg(r.row('gasLimit'))
      .run(this.conn)
  }
}
