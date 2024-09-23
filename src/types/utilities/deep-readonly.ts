// eslint-disable-next-line @typescript-eslint/ban-types
type DeepReadonly<T> = T extends Function
  ? T
  : T extends object
    ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
    : T
export default DeepReadonly
