import { regularExp } from '../../../config';

export class CreateUserDto {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  static execute(object: { [key: string]: any }): [string?, CreateUserDto?] {
    const { name, email, password } = object;

    if (!name) return ['Name is required'];
    if (!regularExp.name.test(name)) return ['Format name is invalid'];
    if (!email) return ['Email is required'];
    if (!regularExp.email.test(email)) return ['Format email is invalid'];
    if (!password) return ['Password is required'];
    if (!regularExp.password.test(password))
      return ['Format password is invalid'];

    return [
      undefined,
      new CreateUserDto(
        name.trim().toLowerCase(),
        email.trim().toLowerCase(),
        password.trim()
      ),
    ];
  }
}
