import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { IdentityProfile } from '../models/Identity';
import { IdentityService } from '../identity.service';
import { IdentityProviderService } from '../identity.provider.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private identityService: IdentityProviderService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'], // Inform google what data we want to access
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: IdentityProfile,
  ) {
    return this.identityService.validateIdPUserIdentity(profile);
  }
}
