import { regularExp } from '../../../config';

export class CreateTransactionDto {
  constructor(
    public readonly amount: string,
    public readonly accountNumber: string
  ) {}
  static execute(object: {
    [key: string]: any;
  }): [string?, CreateTransactionDto?] {
    const { amount, accountNumber } = object;
    if (!amount) return ['Amount is required'];
    if (!regularExp.amount.test(amount)) return ['Format amount is invalid'];
    if (!accountNumber) return ['Account number is required'];
    if (!regularExp.accountNumber.test(accountNumber))
      return ['Format accountNumber is invalid'];

    return [undefined, new CreateTransactionDto(amount, accountNumber)];
  }
}
