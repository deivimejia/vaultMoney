import { regularExp } from '../../../config';

export class LoginUserDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
  static execute(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    if (!email) return ['Email is required'];
    if (!regularExp.email.test(email)) return ['Format email is invalid'];
    if (!password) return ['Password is required'];
    if (!regularExp.password.test(password))
      return ['Format password is invalid'];

    return [
      undefined,
      new LoginUserDto(email.trim().toLowerCase(), password.trim()),
    ];
  }
}
