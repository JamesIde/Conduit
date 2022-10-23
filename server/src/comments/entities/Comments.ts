import { Article } from 'src/article/entities/Article';
import { User } from 'src/user/entities/User';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'timestamp with time zone', select: false })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;
}
