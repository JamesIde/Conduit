import { User } from 'src/user/entities/User';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Follows {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateFollowed: Date;

  @Column()
  userBeingFollowed: string;

  @Column()
  userFollowingThePerson: string;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  followerUser: User;
}
