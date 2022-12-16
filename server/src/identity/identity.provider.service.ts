import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/User';
import { IdentityService } from './identity.service';
import { IdentityProfile } from './models/Identity';

@Injectable()
export class IdentityProviderService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private identityService: IdentityService,
  ) {}

  /**
   * Public method to register a user from a third party provider (google/github)
   * This method always returns a profile to be used in @see IdentityController.googleCallback and @see IdentityController.githubCallback
   */
  async validateIdPUserIdentity(profile: IdentityProfile): Promise<User> {
    if (!profile) {
      throw new HttpException('No profile provided', HttpStatus.BAD_REQUEST);
    }
    const isRegistered = await this.identityService.checkIfUserExists(profile);

    if (!isRegistered) {
      return this.registerIdPUser(profile);
    }
    return this.loginIdPUser(profile);
  }

  /**
   * A private method to register a user authenticated with github (or any other IdP)
   */
  private async registerIdPUser(profile: IdentityProfile): Promise<User> {
    const newIdpUser = this.userRepository.create({
      username: profile.username ? profile.username : profile.displayName,
      email: profile.emails[0].value,
      socialLogin: true,
      providerId: profile.id,
      providerName: profile.provider,
      image_url: profile.photos[0].value,
      // credentials: {
      //   password: null,
      //   createdAt: new Date(),
      // },
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
      where: { providerId: profile.id },
    });
    if (!user) {
      throw new HttpException(
        'An error occured logging in your profile. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return user;
  }
}

/**
 * Then set up logic to generate access token, refresh token and cookie for that.
 * Modify the existing helper.Service to serve both user/pass users and IdP users
 * The resp objs for register and login for user/pass should be ok: boolean, token: string.
 * UI then calls getProfile and displays the data...
 */
