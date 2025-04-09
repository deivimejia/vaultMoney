import { EmailService } from '../../../common/services/email.service';
import { encriptAdapter, envs, jwtAdapter } from '../../../config';
import { User } from '../../../data/postgres/models/user.models';
import { CreateUserDto, CustomError } from '../../../domain';
import pug from 'pug';
import path, { dirname } from 'path';

export class CreateUserService {
  constructor(private readonly emailServie: EmailService) {}
  async execute(userData: CreateUserDto) {
    const user = new User();
    user.name = userData.name;
    user.email = userData.email;
    user.password = this.encriptPassword(userData.password);
    user.account_number = this.generateAccountNumber();
    user.balance = 0;

    try {
      await user.save();
      this.sendLinkToForEmailValidateAccount(userData.email, userData.name);
      return {
        message: 'User created successfullly',
      };
    } catch (error: any) {
      this.throwException(error);
    }
  }

  private throwException(error: any) {
    if (error.code === '23505') {
      throw CustomError.conflict('Email already in use');
    }
    if (error.code === '22P02') {
      throw CustomError.unprocessableEntity('Invalid data type');
    }

    throw CustomError.internalServerError('Error trying to create user');
  }
  private generateAccountNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
    return timestamp + randomDigits;
  }

  private encriptPassword(password: string): string {
    return encriptAdapter.hash(password);
  }

  private sendLinkToForEmailValidateAccount = async (
    email: string,
    name: string
  ) => {
    const token = await jwtAdapter.generateToken({ email }, '300s');
    if (!token) throw CustomError.internalServerError('Error getting token');
    const link = `http://${envs.WEBSERVICE_URL}/api/v1/auth/validate-account/${token}`;
    const templatePug = path.resolve(
      __dirname,
      '../../../views/emailValidateAccount.pug'
    );
    const html = pug.renderFile(templatePug, {
      name,
      validationLink: link,
      email,
    });
    const isSent = this.emailServie.sendEmail({
      to: email,
      subject: 'Validate Your Account',
      htmlBody: html,
    });
    if (!isSent) throw CustomError.internalServerError('Error sending email');
    return true;
  };

  public validateAccount = async (token: string) => {
    const payLoad = await jwtAdapter.validateToken(token);
    if (!payLoad) throw CustomError.badRequest('Invalid token');
    const { email } = payLoad as { email: string };
    if (!email)
      throw CustomError.internalServerError('Email not found in token');

    const user = await this.findOneUserByEmail(email);
    user.status = true;
    try {
      await user.save();
      return { message: 'User activated' };
    } catch (error) {
      throw CustomError.internalServerError('Something went very wrong');
    }
  };

  private findOneUserByEmail = async (email: string) => {
    const user = await User.findOne({ where: { email: email } });
    if (!user)
      throw CustomError.internalServerError('Email not register in db');
    return user;
  };
}
