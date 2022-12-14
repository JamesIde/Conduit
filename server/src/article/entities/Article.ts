import { User } from 'src/identity/entities/User';
import { Comment } from 'src/comments/entities/Comments';
import { Favourites } from 'src/favourites/entities/Favourites';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Index({ fulltext: true })
  @Column({ unique: true })
  title: string;

  @Index({ fulltext: true })
  @Column()
  description: string;

  @Index({ fulltext: true })
  @Column('text')
  body: string;

  @Index({ fulltext: true })
  @Column({ type: 'text', array: true })
  tags: string[];

  @Column({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'timestamp with time zone', select: false })
  updatedAt: Date;

  @Column({ default: 0 })
  favouriteCount: number;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment;

  @OneToMany(() => Favourites, (favourite) => favourite.favUser)
  favArticle: Favourites;
}
