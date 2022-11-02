export interface SignIn {
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  image: string;
  bio: string;
}

export interface UpdateProfile {
  email: string;
  image: string;
  bio: string;
}

export interface UpdateProfileSuccess {
  id: number;
  username: string;
  email: string;
  name: string;
  image: string;
  bio: string;
}

export interface UserSignInSuccess {
  message: string;
  user: User;
  token: string;
}

export interface AccessTokenSuccess {
  ok: boolean;
  accessToken: string;
}
