import { Router } from 'express';
import {
  CreateTransactionService,
  FinderTransactionService,
  FinderTransactionsService,
} from './services';
import { transactionsController } from './controller';
import { AuthMiddLeware } from '../../common/middleware/auth.middlewares';

export class TransactionsRoutes {
  static get routes(): Router {
    const router = Router();
    const createTransactions = new CreateTransactionService();
    const finderTransactions = new FinderTransactionsService();
    const finderTransaction = new FinderTransactionService();

    const controller = new transactionsController(
      createTransactions,
      finderTransactions,
      finderTransaction
    );
    router.use(AuthMiddLeware.protect);
    router.post('/transactions', controller.create);
    router.get('/transactions', controller.findAll);
    router.get('/transactions/:id', controller.findOne);
    return router;
  }
}
