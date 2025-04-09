import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.model';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 100,
    nullable: false,
  })
  name: string;

  @Column('varchar', {
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('text', {
    nullable: false,
  })
  password: string;

  @Column('varchar', {
    unique: true,
    // nullable: false,
    length: 20,
  })
  account_number: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  balance: number;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_at: Date;

  @Column('boolean', {
    default: false,
    nullable: false,
  })
  status: boolean;

  @Column('enum', {
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: UserRole;

  @OneToMany(() => Transaction, (Transaction) => Transaction.receiver)
  receiver: Transaction[];

  @OneToMany(() => Transaction, (Transaction) => Transaction.sender)
  sender: Transaction[];
}
