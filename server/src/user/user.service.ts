import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/RegisterUserDto';
import { User } from './entities/User';
import { HelperService } from 'src/helper/helper.service';
import { Param, Req, Res } from '@nestjs/common/decorators';
import { Response } from 'express';
import { UserSuccessDto } from './dto/UserSuccessDto';
import { LoginUserDto } from './dto/LoginUserDto';
import { UpdateProfileDto } from './dto/UpdateProfileDto';
import { UserProfile } from './dto/UserProfileDto';
import { Article } from 'src/article/entities/Article';
import * as bcrypt from 'bcryptjs';
import { Follows } from 'src/follows/entities/Follows';
/*
  _    _  _____ ______ _____            _    _ _______ _    _ ______ _   _ _______ _____ _____       _______ _____ ____  _   _ 
 | |  | |/ ____|  ____|  __ \      /\  | |  | |__   __| |  | |  ____| \ | |__   __|_   _/ ____|   /\|__   __|_   _/ __ \| \ | |
 | |  | | (___ | |__  | |__) |    /  \ | |  | |  | |  | |__| | |__  |  \| |  | |    | || |       /  \  | |    | || |  | |  \| |
 | |  | |\___ \|  __| |  _  /    / /\ \| |  | |  | |  |  __  |  __| | . ` |  | |    | || |      / /\ \ | |    | || |  | | . ` |
 | |__| |____) | |____| | \ \   / ____ \ |__| |  | |  | |  | | |____| |\  |  | |   _| || |____ / ____ \| |   _| || |__| | |\  |
  \____/|_____/|______|_|  \_\ /_/    \_\____/   |_|  |_|  |_|______|_| \_|  |_|  |_____\_____/_/    \_\_|  |_____\____/|_| \_|
                                                                                                                               
                                                                                                                                                                                                                                                                                                                          
*/

/**
 * Set of public methods for user registration and login.
 */

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Follows) private followRepo: Repository<Follows>,
    private authService: HelperService,
  ) {}
  /**
   * A public method to call to register a user
   * @returns Promise<LoggedUserDto>
   */
  async registerUser(
    @Res() res: Response,
    registerUser: RegisterUserDto,
  ): Promise<UserSuccessDto> {
    const { username, email, password, confirmPassword } = registerUser;

    let isValidEmail = await this.userRepo.findOne({
      where: [{ email: email }],
    });
    if (isValidEmail) {
      throw new HttpException(
        'A user exists with that email',
        HttpStatus.BAD_REQUEST,
      );
    }

    let isValidUserName = await this.userRepo.findOne({
      where: [{ username: username }],
    });
    if (isValidUserName) {
      throw new HttpException(
        'Please enter a unique username',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    let hashPwd = await bcrypt.hash(password, 10);
    try {
      let user = this.userRepo.create({
        username: username,
        email: email,
        credentials: {
          createdAt: new Date(),
          password: hashPwd,
        },
      });

      let createdUser = await this.userRepo.save(user);
      if (createdUser) {
        await this.authService.sendRefreshCookie(res, createdUser);
        return {
          message: 'User created successfully',
          user: {
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
          },
          token: await this.authService.generateAccessToken(createdUser),
        };
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A public method to login a user with email and password
   * Returns the user object, with access token and sends a cookie.
   */
  async loginUser(
    @Res() res: Response,
    loginUser: LoginUserDto,
  ): Promise<UserSuccessDto> {
    const isValidUser = await this.userRepo.findOne({
      where: {
        email: loginUser.email,
      },
      relations: {
        credentials: true,
      },
    });

    if (!isValidUser) {
      throw new HttpException(
        `No account found with email ${loginUser.email}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginUser.password,
      isValidUser.credentials.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        'Incorrect password, please try again',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Send cookie
    await this.authService.sendRefreshCookie(res, isValidUser);
    return {
      message: 'User logged in',
      user: {
        id: isValidUser.id,
        username: isValidUser.username,
        email: isValidUser.email,
      },
      token: await this.authService.generateAccessToken(isValidUser),
    };
  }

  /**
   * A public method to update the user profile
   * Fields like name, image and bio may be updated
   */
  async updateProfile(@Req() req, updateProfile: UpdateProfileDto) {
    try {
      await this.userRepo.update(req.user, updateProfile);
      return {
        success: true,
        message: 'Successfully updated profile',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * A public method to fetch the user based on decoded token
   */
  async getProfile(@Req() req): Promise<UserProfile> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: req.user,
        },
        relations: ['comments', 'articles'],
      });
      return user as unknown as UserProfile;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * A publicly available method to get a user profile based on slug
   * This differs from @see getProfile
   * Used by general users to click on user profiles and see their articles
   */
  async getUserProfile(@Req() req, username: string): Promise<UserProfile> {
    if (!username)
      throw new HttpException(
        'Username must be provided',
        HttpStatus.BAD_REQUEST,
      );

    try {
      const queryUser = await this.userRepo.findOne({
        where: {
          username: username,
        },
        select: {
          email: false,
        },
        relations: ['articles'],
      });

      if (!queryUser) {
        throw new HttpException('User profile not found', HttpStatus.NOT_FOUND);
      }

      const user: UserProfile = {
        username: queryUser.username,
        name: queryUser.name,
        image: queryUser.name,
        bio: queryUser.bio,
        articles: queryUser.articles as unknown as Article[],
      };
      if (!req.user) {
        return user;
      }

      const isFollowed = await this.followRepo.findOne({
        where: {
          followerUser: req.user,
        },
      });

      if (isFollowed) {
        user.isFollowed = true;
        return user;
      } else {
        return user;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * A publicly available method to follow a user based on username
   *
   */
  async followUser(@Req() req, username: string) {
    if (username === req.user) {
      throw new HttpException(
        'You cannot follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValidUser = await this.userRepo.findOne({
      where: {
        username: username,
      },
    });

    if (!isValidUser) {
      throw new HttpException(
        `User '${username}' not found `,
        HttpStatus.NOT_FOUND,
      );
    }

    const isUserFollowing = await this.followRepo.findOne({
      where: {
        userFollowingThePerson: req.user,
        userBeingFollowed: username,
      },
    });

    if (isUserFollowing) {
      throw new HttpException(
        'You are already following this user',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const createFollow = this.followRepo.create({
        userFollowingThePerson: req.user,
        userBeingFollowed: isValidUser.username,
        followerUser: isValidUser,
        dateFollowed: new Date(),
      });
      await this.followRepo.save(createFollow);

      return {
        ok: true,
        message: 'User followed!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A publically available method to unfollow a user
   */
  async unfollowUser(@Req() req, username: string) {
    try {
      const follower = await this.followRepo.findOne({
        where: {
          userBeingFollowed: username,
          followerUser: req.user,
        },
      });
      await this.followRepo.remove(follower);
      return {
        ok: true,
        message: 'User unfollowed',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*
   * A dummy method to fetch all users
   */
  async getAllUsers() {
    // Return all users and articles
    return await this.userRepo.find({
      select: {
        articles: {
          slug: true,
        },
      },
      relations: ['articles'],
    });
  }
}
