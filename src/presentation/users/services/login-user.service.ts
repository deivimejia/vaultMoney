import { encriptAdapter, envs, jwtAdapter } from '../../../config';
import { User } from '../../../data/postgres/models/user.models';
import { CustomError, LoginUserDto } from '../../../domain';

export class LoginUserService {
  async execute(credentials: LoginUserDto) {
    const user = await this.ensureUserExists(credentials.email);

    this.ensurePasswordIsCorrect(credentials.password, user!.password);
    const token = await this.generateToken(
      { id: user!.id },
      envs.JWT_EXPIRE_IN
    );
    return {
      token,
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        accountNumber: user?.account_number,
        balance: user?.balance,
        role: user?.role,
      },
    };
  }

  private async ensureUserExists(email: string) {
    const user = await User.findOne({
      where: {
        email: email,
        status: true,
      },
    });
    if (!user) {
      throw CustomError.notFound('Invalid credentials');
    }
    return user;
  }
  private ensurePasswordIsCorrect(
    unHashedPassword: string,
    hashedPassword: string
  ) {
    const isMatch = encriptAdapter.compare(unHashedPassword, hashedPassword);
    if (!isMatch) {
      throw CustomError.unAutorized('Invalid credentials');
    }
  }

  private async generateToken(payLoad: any, duration: string) {
    const token = await jwtAdapter.generateToken(payLoad, duration);
    if (!token) {
      throw CustomError.internalServerError('Error while creating JWT');
    }
    return token;
  }
}
