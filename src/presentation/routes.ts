import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { TransactionsRoutes } from './transactions/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use('/api/v1', UserRoutes.routes);
    router.use('/api/v1', TransactionsRoutes.routes);
    return router;
  }
}
