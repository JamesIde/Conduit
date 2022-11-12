import {
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/CreateArticleDto';
import { UpdateArticleDto } from './dto/UpdateArticleDto';
import { Article } from './entities/Article';
import { Request } from 'express';
import {
  ArticlesDto,
  Article as ArticleDto,
  Metadata,
} from './dto/RetrieveArticleDto';
import { User } from 'src/user/entities/User';
import { Favourites } from 'src/favourites/entities/Favourites';
import { Follows } from 'src/follows/entities/Follows';
import { randomUUID } from 'crypto';
/**
           _____ _______ _____ _____ _      ______  _____ 
     /\   |  __ \__   __|_   _/ ____| |    |  ____|/ ____|
    /  \  | |__) | | |    | || |    | |    | |__  | (___  
   / /\ \ |  _  /  | |    | || |    | |    |  __|  \___ \ 
  / ____ \| | \ \  | |   _| || |____| |____| |____ ____) |
 /_/    \_\_|  \_\ |_|  |_____\_____|______|______|_____/ 
                                                                                                            
 */

/*
 * Set of methods for CRUD operations of articles
 * Most of these methods will require the decoded user ID in @Req() req: Request object
 */

@Injectable()
export class ArticleService {
  cachedTags: any;
  cachedTagTime: any;
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Favourites) private favRepo: Repository<Favourites>,
    @InjectRepository(Follows) private followRepo: Repository<Follows>,
  ) {}

  /**
  _____  _    _ ____  _      _____ _____   __  __ ______ _______ _    _  ____  _____   _____ 
 |  __ \| |  | |  _ \| |    |_   _/ ____| |  \/  |  ____|__   __| |  | |/ __ \|  __ \ / ____|
 | |__) | |  | | |_) | |      | || |      | \  / | |__     | |  | |__| | |  | | |  | | (___  
 |  ___/| |  | |  _ <| |      | || |      | |\/| |  __|    | |  |  __  | |  | | |  | |\___ \ 
 | |    | |__| | |_) | |____ _| || |____  | |  | | |____   | |  | |  | | |__| | |__| |____) |
 |_|     \____/|____/|______|_____\_____| |_|  |_|______|  |_|  |_|  |_|\____/|_____/|_____/                                                                                                                                                                     
 */

  /**
   * A public method that creates an article.
   * It takes the request to access decoded user ID, this links user to article
   */
  async createArticle(@Req() req, createArticleDto: CreateArticleDto) {
    let slug = this.generateSlug(createArticleDto.title);
    const articleExists = await this.articleRepo.findOne({
      where: {
        slug: slug,
      },
    });

    if (articleExists) {
      throw new HttpException(
        `Article title '${createArticleDto.title}' already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      let article = await this.articleRepo.create({
        ...createArticleDto,
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: req.user,
      });
      return await this.articleRepo.save(article);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A public method to retrieve all articles based on the following criteria
   * @param limit: The max number of records to return
   * @param skip: The offset of the records to return
   * @param page: The current page number
   * @param tag:  The tag to filter articles e.g. [Angular, React]
   * @param user: The user id of a logged in user. May be undefined.
   * Protected by @see LoggedUserGuard
   */
  async getArticles(@Req() req): Promise<any> {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const user = req.user;
    const tag: string = req.query.tag;
    if (!user && !tag) {
      return await this.getDefaultArticles(page, limit);
    }
    if (user && !tag) {
      const { startIndex, results } = await this.paginateArticles(page, limit);
      return await this.getUserFavouritedArticles(
        user,
        startIndex,
        limit,
        results,
      );
    }
    if (!user && tag) {
      return await this.getArticlesByTag(tag, page, limit);
    }
    if (user && tag) {
      return await this.getArticlesByTagAndUser(tag, page, limit, user);
    }
  }
  /**
   * A public method for finding an article based on slug
   */
  async getArticleBySlug(@Req() req, slug: string): Promise<ArticleDto> {
    const article = await this.articleRepo.findOne({
      where: {
        slug: slug,
      },
      relations: {
        author: true,
        comments: {
          author: true,
        },
      },
    });

    if (!article) {
      throw new HttpException(
        `Article '${slug}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!req.user) {
      return article;
    }
    // See if the user has favourited this article
    const userFav = await this.favRepo.findOne({
      where: {
        favouritedArticle: {
          slug: slug,
        },
        favUser: {
          id: req.user,
        },
      },
    });

    if (userFav) {
      return {
        ...article,
        isFavourited: true,
      };
    }
    return {
      ...article,
      isFavourited: false,
    };
  }

  /**
   * A public method for updating an article based on slug
   */
  async updateArticle(
    @Req() req,
    slug: string,
    updateArticle: UpdateArticleDto,
  ) {
    const isValidArticle = await this.articleRepo.findOne({
      where: {
        slug: slug,
        author: req.user,
      },
    });

    if (!isValidArticle) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    try {
      updateArticle.updatedAt = new Date();
      // Generate new slug based on title in param
      if (updateArticle.title) {
        const newSlug = this.generateSlug(updateArticle.title);
        updateArticle.slug = newSlug;
        await this.articleRepo.update({ slug: slug }, updateArticle);
      } else {
        // Ignore slug, update title, body, etc
        await this.articleRepo.update({ slug: slug }, updateArticle);
      }
      return {
        success: true,
        message: 'Successfully updated article',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*
   *  A public method to delete an article based on slug
   *  Finds the article based on slug and matches with the user ID associated with it
   *  Only the author can delete the article
   */
  async deleteArticle(@Req() req, slug: string) {
    // Check req.user matches userID linked to article
    const isValidArticle = await this.articleRepo.findOne({
      where: {
        slug: slug,
        author: req.user,
      },
    });

    if (!isValidArticle) {
      throw new HttpException(
        `Article '${slug}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.articleRepo.delete({ slug: slug });
      return {
        ok: true,
        message: 'Article successfully deleted',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * A public method to favourite an article base on slug, for a user.
   */
  async favouriteArticle(@Req() req, slug: string) {
    const isValidArticle = await this.articleRepo.findOne({
      where: {
        slug: slug,
      },
      relations: ['author'],
    });

    if (!isValidArticle)
      throw new HttpException('Article not found', HttpStatus.BAD_REQUEST);

    if (isValidArticle.author.id === req.user) {
      throw new HttpException(
        'You cannot favourite your own article!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if article is already favourited by user
    const isValidFavourite = await this.favRepo.findOne({
      where: {
        favUser: {
          id: req.user,
        },
        favouritedArticle: {
          id: isValidArticle.id,
        },
      },
    });

    if (isValidFavourite) {
      throw new HttpException(
        'Article already favourited',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const favourite = this.favRepo.create({
        dateFavourited: new Date(),
        favUser: {
          id: req.user,
        },
        favouritedArticle: {
          id: isValidArticle.id,
        },
      });
      // Increment article favourite count
      isValidArticle.favouriteCount += 1;
      await this.articleRepo.save(isValidArticle);
      await this.favRepo.save(favourite);
      return {
        ok: true,
        message: 'Article favourited!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A public method to unfavourite an article base on slug, for a user.
   */
  async unfavouriteArticle(@Req() req, slug: string) {
    const isValidArticle = await this.articleRepo.findOne({
      where: {
        slug: slug,
      },
      relations: ['author'],
    });

    if (!isValidArticle)
      throw new HttpException('Article not found', HttpStatus.BAD_REQUEST);

    if (isValidArticle.author.id === req.user) {
      throw new HttpException(
        'You cannot unfavourite your own article!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const unfavouriteArticle = await this.favRepo.findOne({
      where: {
        favUser: {
          id: req.user,
        },
        favouritedArticle: {
          id: isValidArticle.id,
        },
      },
      relations: ['favouritedArticle'],
    });

    if (!unfavouriteArticle) {
      throw new HttpException(
        'Article already unfavourited!',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.favRepo.delete(unfavouriteArticle.id);
      (isValidArticle.favouriteCount as any) -= 1;
      await this.articleRepo.save(isValidArticle);
      return {
        ok: true,
        message: 'Article unfavourited!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A publically available method to get the articles of the logged in users followers
   */
  async getUserFeed(@Req() req): Promise<any> {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const user = req.user;

    const following = await this.followRepo.find({
      where: { userFollowingThePerson: user },
    });

    if (!following) {
      throw new HttpException(
        "You aren't following anyone!",
        HttpStatus.BAD_REQUEST,
      );
    }

    const userFeed = await this.articleRepo.find({
      where: {
        author: {
          username: In(following.map((follow) => follow.userBeingFollowed)),
        },
      },
      relations: {
        author: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    if (endIndex < userFeed.length) {
      results['next'] = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results['previous'] = {
        page: page - 1,
        take: limit,
      };
    }

    const userFavourites = await this.getFavouriteArticleSlugs(user);
    const userFeedWithFavouritedArticles = userFeed.map((article) => {
      if (userFavourites.includes(article.slug)) {
        return {
          ...article,
          isFavourited: true,
        };
      }
      return {
        ...article,
        isFavourited: false,
      };
    });
    return {
      ...results,
      articleCount: userFeedWithFavouritedArticles.length,
      articles: userFeedWithFavouritedArticles,
    };

    // return {
    //   metadata: {
    //     take: take,
    //     skip: skip,
    //     isLogged: user ? true : false,
    //   },
    //   articleCount: userFeed.length,
    //   articles: userFeed,
    // };
  }

  /**
   * A public method to retrieve all articles written by the logged in user
   */
  async getUserArticles(
    @Req() req,
    @Param('username') username: string,
  ): Promise<any> {
    const userArticles = await this.articleRepo.find({
      where: {
        author: {
          username: username,
        },
      },
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      articleCount: userArticles.length,
      articles: userArticles,
    };
  }

  /**
   * A public method to get a users favourited articles
   */
  async getFavourites(@Req() req) {
    const favourites = await this.favRepo.find({
      where: {
        favUser: {
          id: req.user,
        },
      },
      relations: {
        favouritedArticle: {
          author: true,
        },
      },
    });

    if (!favourites) {
      throw new HttpException(
        'No articles favourited yet. Get reading!',
        HttpStatus.NOT_FOUND,
      );
    }

    // Find articles where they are favourited by the user
    const favArticles = await this.articleRepo.find({
      where: {
        id: In(favourites.map((fav) => fav.favouritedArticle.id)),
      },
      relations: ['author'],
      order: {
        favArticle: {
          dateFavourited: 'ASC',
        },
      },
      // TODO Check this is ordering properly
    });
    const articles = favArticles.map((article) => {
      return {
        ...article,
        isFavourited: true,
      };
    });
    return {
      articleCount: favourites.length,
      articles: articles,
    };
  }

  /**
   * A public method to return the tags of the most recent 5 articles, without duplicates.
   * It uses in memory storage to cache the results every 30 minutes for improved performance.
   */
  async getTags() {
    if (
      this.cachedTagTime &&
      this.cachedTagTime > Date.now() - 30 * 60 * 1000
    ) {
      return {
        cached: true,
        cachedTagTime: new Date(this.cachedTagTime).toLocaleString('en-AU'),
        tags: this.cachedTags,
      };
    } else {
      const articleTags = await this.articleRepo.find({
        select: {
          tags: true,
        },
        order: {
          createdAt: 'DESC',
        },
        take: 5,
      });
      const tags = this.generatePopularTags(articleTags);
      this.cachedTags = tags;
      this.cachedTagTime = Date.now();
      return {
        cached: false,
        cachedTime: new Date(this.cachedTagTime).toLocaleString('en-AU'),
        tags: this.cachedTags,
      };
    }
  }

  /*
  _____  _____  _______      __  _______ ______   __  __ ______ _______ _    _  ____  _____   _____ 
 |  __ \|  __ \|_   _\ \    / /\|__   __|  ____| |  \/  |  ____|__   __| |  | |/ __ \|  __ \ / ____|
 | |__) | |__) | | |  \ \  / /  \  | |  | |__    | \  / | |__     | |  | |__| | |  | | |  | | (___  
 |  ___/|  _  /  | |   \ \/ / /\ \ | |  |  __|   | |\/| |  __|    | |  |  __  | |  | | |  | |\___ \ 
 | |    | | \ \ _| |_   \  / ____ \| |  | |____  | |  | | |____   | |  | |  | | |__| | |__| |____) |
 |_|    |_|  \_\_____|   \/_/    \_\_|  |______| |_|  |_|______|  |_|  |_|  |_|\____/|_____/|_____/                                                                                                                                                                                                
*/

  /**
   * A private method for converting the first 5 articles tags into an array of tags, with no duplicates.
   * The first 10 tags are returned
   */
  private generatePopularTags(tags: Article[]) {
    let tagList = [];
    for (let i = 0; i < tags.length; i++) {
      for (let j = 0; j < tags[i].tags.length; j++) {
        tagList.push(tags[i].tags[j]);
      }
    }

    let filteredTags = [...new Set(tagList)];
    return filteredTags.slice(0, 10);
  }

  /**
   * A private method for converting title into slug
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * A private method that returns all favourited article slugs with the logged in user
   */
  private async getFavouriteArticleSlugs(user) {
    const userFavourites = await this.favRepo.find({
      where: {
        favUser: {
          id: user,
        },
      },
      relations: {
        favouritedArticle: true,
      },
    });

    const favArticleSlugs = [];

    userFavourites.forEach((fav) => {
      favArticleSlugs.push(fav.favouritedArticle.slug);
    });
    return favArticleSlugs;
  }

  /**
   * A private method to get all articles using the query builder for text searching based on searchTerm param
   */
  private async getArticlesByTag(tag: string, page: number, limit: number) {
    if (page == 0) {
      page = 1;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    // We need the total count of articles with matching tag to calculate the pagination
    const articlesByTagCount = await this.getTotalArticleTagCount(tag);

    if (endIndex < articlesByTagCount.length) {
      results['next'] = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results['previous'] = {
        page: page - 1,
        take: limit,
      };
    }

    const articles = await this.articleRepo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.comments', 'comments')
      .where('article.tags @> :tag', { tag: `{"${tag}"}` })
      .orderBy('article.createdAt', 'DESC')
      .skip(startIndex)
      .take(limit)
      .getMany();

    return {
      ...results,
      articleCount: articles.length,
      articles: articles,
    };
  }

  /**
   * This method is used to get the total count of articles with matching tag for pagination.
   * We use the number of articles to calculate the end index (whether a user can click 'next' page) of the pagination.
   */
  private async getTotalArticleTagCount(tag: string) {
    return await this.articleRepo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.comments', 'comments')
      .where('article.tags @> :tag', { tag: `{"${tag}"}` })
      .orderBy('article.createdAt', 'DESC')
      .getMany();
  }

  /**
   * A private method to get all articles based on a tag, and check if the user has favourited the article.
   * It uses @see getFavouriteArticleSlugs to get all the slugs of articles the user has favourited.
   * It uses @see getTotalArticleTagCount to get the total count of articles with matching tag for pagination.
   * It then checks if the article slug is in the array of favourited article slugs.
   */
  private async getArticlesByTagAndUser(
    tag: string,
    page: number,
    limit: number,
    user: any,
  ) {
    console.log('Getting Articles By Tag With Logged User');
    if (page == 0) {
      page = 1;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    const totalTagCount = await this.getTotalArticleTagCount(tag);

    if (endIndex < totalTagCount.length) {
      results['next'] = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results['previous'] = {
        page: page - 1,
        take: limit,
      };
    }

    const articlesByTag = await this.articleRepo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.comments', 'comments')
      .where('article.tags @> :tag', { tag: `{"${tag}"}` })
      .orderBy('article.createdAt', 'DESC')
      .skip(startIndex)
      .take(limit)
      .getMany();

    const slugs = await this.getFavouriteArticleSlugs(user);

    const userFavouriteArticles = articlesByTag.map((article) => {
      if (slugs.includes(article.slug)) {
        return {
          ...article,
          isFavourited: true,
        };
      }
      return {
        ...article,
        isFavourited: false,
      };
    });

    return {
      ...results,
      articlesCount: userFavouriteArticles.length,
      articles: userFavouriteArticles,
    };
  }

  /**
   * A private method for getting all articles that a logged in user has favourited.
   * It does not filter by tag selected, only by user favourites.
   * It relies on @see LoggedUserGuard to get the logged in user
   */
  private async getUserFavouritedArticles(
    user: any,
    startIndex: number,
    limit: number,
    results: {},
  ) {
    console.log('Getting User Favourite Articles');
    const slugs = await this.getFavouriteArticleSlugs(user);
    let articles = await this.articleRepo.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['author', 'comments'],
      skip: startIndex,
      take: limit,
    });

    const userPresentArticles = articles.map((article) => {
      if (slugs.includes(article.slug)) {
        return {
          ...article,
          isFavourited: true,
        };
      }
      return {
        ...article,
        isFavourited: false,
      };
    });

    return {
      ...results,
      articlesCount: userPresentArticles.length,
      articles: userPresentArticles,
    };
  }

  /**
   * A private method to paginate articles
   * @param page The current page number
   * @param limit The max number of records to return
   */
  private async paginateArticles(page: number, limit: number, tag?: string) {
    if (page == 0) {
      page = 1;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    if (endIndex < (await this.articleRepo.count())) {
      results['next'] = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results['previous'] = {
        page: page - 1,
        take: limit,
      };
    }
    return { startIndex, results };
  }

  /**
   * A private method to retrieve all articles with no logged in user or tag for filtering.
   * This is the default method called when the user visits the home page for the first time.
   */
  private async getDefaultArticles(page: number, limit: number) {
    console.log('Getting Default Articles');
    const { startIndex, results } = await this.paginateArticles(page, limit);
    let articles = await this.articleRepo.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['author', 'comments'],
      skip: startIndex,
      take: limit,
    });

    return {
      ...results,
      articlesCount: articles.length,
      articles: articles,
    };
  }
}
