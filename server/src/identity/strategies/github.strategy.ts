import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { IdentityProviderService } from '../identity.provider.service';
import { IdentityService } from '../identity.service';
import { IdentityProfile } from '../models/Identity';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private idPService: IdentityProviderService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['public_profile'], // Inform github what data we want to access
    });
  }

  /**
   * A method that is called after the user has authenticated with github
   * It prevents the user from accessing the callback route if the user does not exist in some capacity
   * Under the hood, passport attaches the profile to req.user
   */
  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: IdentityProfile,
  ) {
    return this.idPService.validateIdPUserIdentity(profile);
  }
}
