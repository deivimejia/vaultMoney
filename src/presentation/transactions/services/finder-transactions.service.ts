import { Transaction } from '../../../data/postgres/models/transaction.model';
import { CustomError } from '../../../domain';

export class FinderTransactionsService {
  async execute(userId: string) {
    try {
      return await Transaction.find({
        select: {
          id: true,
          amount: true,
          transactionDate: true,
        },
        where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      });
    } catch (error) {
      throw CustomError.internalServerError(
        'Error trying to find transactions'
      );
    }
  }
}
