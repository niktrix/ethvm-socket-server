// TODO: Refactot to use Promises (left here till migration is done)

export interface Callback {
  (err: Error, result: any): any
}
