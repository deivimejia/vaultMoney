import { Router } from 'express';
import {
  CreateUserService,
  FinderUserService,
  LoginUserService,
} from './services';
import { userController } from './controller';
import { EmailService } from '../../common/services/email.service';
import { envs } from '../../config';
import { AuthMiddLeware } from '../../common/middleware/auth.middlewares';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const emailServie = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_MAIL
    );
    const createUser = new CreateUserService(emailServie);
    const loginUser = new LoginUserService();
    const findOneUser = new FinderUserService();

    const controller = new userController(createUser, loginUser, findOneUser);

    router.post('/auth/register', controller.create);

    router.get('/auth/validate-account/:token', controller.validateAccount);

    router.post('/auth/login', controller.login);

    router.use(AuthMiddLeware.protect);

    router.get('/users/me', controller.finderMe);

    return router;
  }
}
