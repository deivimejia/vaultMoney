import { Request, Response } from 'express';
import { CreateTransactionDto, CustomError } from '../../domain';
import {
  CreateTransactionService,
  FinderTransactionService,
  FinderTransactionsService,
} from './services';

export class transactionsController {
  constructor(
    private readonly createTransactions: CreateTransactionService,
    private readonly finderTransactions: FinderTransactionsService,
    private readonly finderTransaction: FinderTransactionService
  ) {}
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
  };

  create = (req: Request, res: Response) => {
    const [error, createTransactionDto] = CreateTransactionDto.execute(
      req.body
    );
    if (error) return res.status(422).json({ message: error });

    const user = req.body.sesionUser;
    this.createTransactions
      .execute(createTransactionDto!, user)
      .then((message) => res.status(201).json(message))
      .catch((err) => this.handleError(err, res));
  };

  findOne = (req: Request, res: Response) => {
    const { id } = req.params;
    this.finderTransaction
      .execute(id)
      .then((transaction) => res.status(200).json(transaction))
      .catch((err) => this.handleError(err, res));
  };

  findAll = (req: Request, res: Response) => {
    const id = req.body.sesionUser.id;
    this.finderTransactions
      .execute(id)
      .then((users) => res.status(200).json(users))
      .catch((err) => this.handleError(err, res));
  };
}
