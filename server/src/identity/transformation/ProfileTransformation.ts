import { AccessTokenSuccess } from 'src/jwt/models/Token';
import { UserData } from '../models/Identity';
import { User } from '../entities/User';
export class ProfileTransformation {
  public static transformUserProfile(
    profile: User,
    token: AccessTokenSuccess,
  ): UserData {
    const user: UserData = {
      data: {
        id: profile?.id,
        email: profile?.email,
        name: profile?.username,
        username: profile?.username,
        bio: profile?.bio,
        image_url: profile?.image_url,
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
