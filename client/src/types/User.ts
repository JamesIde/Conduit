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
  image_url: string;
  bio: string;
}

export interface UpdateProfile {
  email?: string;
  bio: string;
}

export interface UpdateProfileSuccess {
  id: number;
  username: string;
  email: string;
  name: string;
  image_url: string;
  bio: string;
}

export interface UserSignInSuccess {
  message: string;
  user: User;
  token: string;
}

export interface Data {
  id?: number;
  email: string;
  name: string;
  username: string;
  bio: string;
  image_url: string;
}

export interface Token {
  accessToken: string;
  ok: boolean;
}

export interface Provider {
  socialLogin: boolean;
  providerId?: any;
  providerName?: any;
}

export interface Profile {
  data: Data;
  token?: Token;
  provider?: Provider;
}

export interface AccessTokenSuccess {
  ok: boolean;
  accessToken: string;
}

export interface FollowMetadata {
  isFollowed: boolean;
  username: string;
}
