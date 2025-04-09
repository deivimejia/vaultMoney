import {
  CreateUserService,
  FinderUserService,
  LoginUserService,
} from './services';
import { CreateUserDto, CustomError, LoginUserDto } from '../../domain';
import { Request, Response } from 'express';
import { envs } from '../../config';

export class userController {
  constructor(
    private readonly createUser: CreateUserService,
    private readonly loginUser: LoginUserService,
    private readonly finderUser: FinderUserService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
  };

  create = (req: Request, res: Response) => {
    const [error, createUserDto] = CreateUserDto.execute(req.body);
    if (error) return res.status(422).json({ message: error });

    this.createUser
      .execute(createUserDto!)
      .then((message) => res.status(201).json(message))
      .catch((err) => this.handleError(err, res));
  };

  validateAccount = (req: Request, res: Response) => {
    const { token } = req.params;
    this.createUser
      .validateAccount(token)
      .then(() => res.send('Email validated successfully'))
      .catch((err) => this.handleError(err, res));
  };

  login = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.execute(req.body);
    if (error) {
      return res.status(422).json({ message: error });
    }
    this.loginUser
      .execute(loginUserDto!)
      .then((data) => {
        res.cookie('token', data.token, {
          httpOnly: true,
          secure: envs.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 3 * 60 * 60 * 1000,
        });
        return res.status(200).json({ user: data.user });
      })
      .catch((err) => this.handleError(err, res));
  };

  finderMe = (req: Request, res: Response) => {
    const id = req.body.sesionUser.id;
    this.finderUser
      .execute(id)
      .then((user) => res.status(200).json(user))
      .catch((err) => this.handleError(err, res));
  };
}
