import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Credentials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  password: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({
    default: 0,
  })
  tokenVersion: number;

  @OneToOne(() => User, (user) => user.credentials)
  user: User;
}
