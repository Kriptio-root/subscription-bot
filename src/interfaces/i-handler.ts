export interface IHandler<T, R> {
  setNext: (handler: IHandler<T, R>) => IHandler<T, R>;
  handle: (request: T) => R
}
