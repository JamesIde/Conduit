import { User } from '../entities/User';
import { IdpRegisterSuccessTransformed } from '../models/Identity';

export class ProfileTransformation {
  public static transformIdpResponse(profile: User): any {
    console.log('input obj', JSON.stringify(profile));
    const user = {
      username: profile.username,
      email: profile.email,
      image_url: profile.image_url,
      socialLogin: profile.socialLogin,
      providerId: profile.providerId,
      providerName: profile.providerName,
      name: profile.username,
      bio: profile.bio,
    };
    console.log('output obj', JSON.stringify(user));
    return user;
  }
}
