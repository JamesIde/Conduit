export interface SignIn {
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
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