import { AccessTokenSuccess } from 'src/jwt/models/Token';
import { User } from '../entities/User';
import { IdpRegisterSuccessTransformed } from '../models/Identity';

export class ProfileTransformation {
  public static transformUserProfile(
    profile: User,
    token: AccessTokenSuccess,
  ): any {
    const user = {
      data: {
        id: profile?.id,
        email: profile?.email,
        name: profile?.username,
        username: profile?.username,
        bio: profile?.bio,
        image: profile?.image_url,
      },
      token: {
        accessToken: token.accessToken,
        ok: token.ok,
      },
      provider: {
        socialLogin: profile?.socialLogin,
        providerId: profile?.providerId,
        providerName: profile?.providerName,
      },
    };
    return user;
  }
}
