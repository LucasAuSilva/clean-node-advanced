
export interface Validation<T = any> {
  validate: (value: T) => Error | undefined
}
