import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/User';
import { IdPToken } from './dto/IdPToken';
import { IdentityProfile } from './models/IdentityProfile';
import jwt_decode from 'jwt-decode';
import { JwtService } from 'src/jwt/jwt.service';
import { ProfileTransformation } from './transformation/ProfileTransformation';
@Injectable()
export class IdentityProviderService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Public method to decode the token generated from IdP.
   * The decoded token contains the profile information we insert into the database.
   * The identity will then be validated and a server generated JWT will be sent back to the client.
   */
  async validateIdpToken(@Res() res, idpToken: IdPToken): Promise<any> {
    const { token } = idpToken;
    var decoded: IdentityProfile = jwt_decode(token);
    decoded.provider = 'google';
    return await this.validateIdPUserIdentity(res, decoded);
  }

  /**
   * Public method to register a user from a third party provider (google/github)
   * It will check if the user exists in the database and if not, it will register the user.
   * Returning a JWT token and a refresh token in cookie
   */
  async validateIdPUserIdentity(
    @Res() res,
    profile: IdentityProfile,
  ): Promise<any> {
    if (!profile) {
      throw new HttpException('No profile provided', HttpStatus.BAD_REQUEST);
    }
    let validated = false;
    let user: User;
    const isRegistered = await this.checkIfUserExists(profile);

    if (!isRegistered) {
      user = await this.registerIdPUser(profile);
      validated = true;
    } else {
      user = await this.loginIdPUser(profile);
      validated = true;
    }

    console.log('usr', user);
    if (validated && user) {
      const token = await this.jwtService.generateAccessToken(user);
      if (token.ok) {
        await this.jwtService.sendRefreshCookie(res, user);
        return ProfileTransformation.transformUserProfile(user, token);
      }
    }
  }

  /**
   * A private method to register a user authenticated with github (or any other IdP)
   */
  async registerIdPUser(profile: IdentityProfile): Promise<User> {
    const newIdpUser = this.userRepository.create({
      username: profile.name,
      email: profile.email,
      name: profile.name,
      isVerified: profile.email_verified,
      socialLogin: true,
      providerId: profile.sub,
      providerName: profile.provider,
      image_url: profile.picture,
      credentials: {
        password: null,
        createdAt: new Date(),
      },
    });
    const regIdpUser = await this.userRepository.save(newIdpUser);

    if (!newIdpUser) {
      throw new HttpException(
        'An error occured registering your profile. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      return regIdpUser;
    }
  }

  /**
   * A private method to login a user authenticated with github (or any other IdP)
   */
  private async loginIdPUser(profile: IdentityProfile): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { providerId: profile.sub },
    });
    if (!user) {
      throw new HttpException(
        'An error occured logging in your profile. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return user;
  }

  /**
   * A private method to check if user exists in the database based on provider Id
   */
  private async checkIfUserExists(profile: IdentityProfile): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [
        {
          providerId: profile.sub,
          providerName: profile.provider,
        },
      ],
    });
    if (!user) {
      return false;
    }
    return true;
  }
}

/**
 * Then set up logic to generate access token, refresh token and cookie for that.
 * Modify the existing helper.Service to serve both user/pass users and IdP users
 * The resp objs for register and login for user/pass should be ok: boolean, token: string.
 * UI then calls getProfile and displays the data...
 */
