import { Transaction } from '../../../data/postgres/models/transaction.model';
import { CustomError } from '../../../domain';

export class FinderTransactionService {
  async execute(id: string) {
    const transaction = await Transaction.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        amount: true,
        transactionDate: true,
        sender: {
          id: true,
          account_number: true,
          name: true,
          email: true,
        },
        receiver: {
          id: true,
          account_number: true,
          name: true,
          email: true,
        },
      },
      relations: ['sender', 'receiver'],
    });
    if (!transaction) {
      throw CustomError.notFound('Transactions not found');
    }
    return transaction;
  }
}
