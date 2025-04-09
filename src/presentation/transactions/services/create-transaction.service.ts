import { Transaction } from '../../../data/postgres/models/transaction.model';
import { User } from '../../../data/postgres/models/user.models';
import { CreateTransactionDto, CustomError } from '../../../domain';

export class CreateTransactionService {
  async execute(transactionData: CreateTransactionDto, user: User) {
    const amount = parseFloat(transactionData.amount);
    const senderExistPromise = this.userSenderExists(
      user.id,
      transactionData.accountNumber
    );
    const validateAmountpromise = this.validateAmount(amount, user.balance);
    const receiverPromise = this.findUserReceiver(
      transactionData.accountNumber
    );
    const [, , receiver] = await Promise.all([
      senderExistPromise,
      validateAmountpromise,
      receiverPromise,
    ]);
    const newTransaction = new Transaction();
    newTransaction.sender = user;
    newTransaction.receiver = receiver;
    newTransaction.amount = amount;
    receiver.balance = parseFloat(receiver.balance as any) + amount;
    user.balance -= amount;

    try {
      await newTransaction.save();
      await receiver.save();
      await user.save();
      return {
        message: 'Transaction sent succesfully',
        transactionId: newTransaction.id,
        newSenderBalance: user.balance,
      };
    } catch (error) {
      throw CustomError.internalServerError('Error create transaction');
    }
  }

  private async findUserReceiver(accountNumber: string) {
    const receiver = await User.findOne({
      where: {
        account_number: accountNumber,
        status: true,
      },
      select: {
        id: true,
        balance: true,
      },
    });
    if (!receiver) {
      throw CustomError.notFound('User receiver not found');
    }

    return receiver;
  }
  private async userSenderExists(id: string, receiverAccountNumber: string) {
    const sender = await User.findOne({
      where: {
        id: id,
      },
    });
    if (!sender) {
      throw CustomError.notFound('User sender not found');
    }
    if (sender.account_number === receiverAccountNumber) {
      throw CustomError.badRequest(
        'Sender and receiver account numbers must be different'
      );
    }
    return sender;
  }
  private validateAmount(amount: number, balance: number) {
    const amountValidate = amount <= balance;
    if (!amountValidate) {
      throw CustomError.conflict('Your balance is insufficient');
    }
  }
}
