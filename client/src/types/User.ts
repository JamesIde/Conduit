export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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
