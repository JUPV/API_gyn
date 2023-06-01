export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Alerta E-mail ja existe')
  }
}
