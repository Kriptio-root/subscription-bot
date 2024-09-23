export interface ITokenChecker {
  checkToken: (token: string | undefined) => boolean
}
