import { Article } from 'src/article/entities/Article';
import { User } from 'src/user/entities/User';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Favourites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp with time zone' })
  dateFavourited: Date;

  @ManyToOne(() => User)
  favUser: User;

  @ManyToOne(() => Article, (article) => article.favArticle)
  favouritedArticle: Article;
}
