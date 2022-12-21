export interface JWTPayload {
  sub: number;
  iat: number;
  identifer: number;
}

export interface Email {
  value: string;
}

export interface Photo {
  value: string;
}

export interface Json {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company?: any;
  blog: string;
  location: string;
  email: string;
  hireable?: any;
  bio?: any;
  twitter_username?: any;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
}

export interface IdentityProfile {
  id: string;
  displayName: string;
  username: string;
  profileUrl: string;
  emails: Email[];
  photos: Photo[];
  provider: string;
  _raw: string;
  _json: Json;
}

export interface Credentials {
  password?: any;
  createdAt: Date;
  id: number;
  tokenVersion: number;
}

export interface IdPRegisterSuccess {
  username: string;
  email: string;
  image_url: string;
  socialLogin: boolean;
  providerId: string;
  providerName: string;
  credentials: Credentials;
  name?: any;
  bio?: any;
  id: number;
}

export interface IdpRegisterSuccessTransformed {
  username: string;
  email: string;
  image_url: string;
  socialLogin: boolean;
  providerId: string;
  providerName: string;
  name?: string | undefined;
  bio?: string | undefined;
}

//////////////////////////////////
/// User Login/ Register Model ///
//////////////////////////////////
export interface Data {
  id: number;
  email: string;
  name: string;
  username: string;
  bio?: any;
  image_url: string;
}

export interface Token {
  accessToken: string;
  ok: boolean;
}

export interface Provider {
  socialLogin: boolean;
  providerId?: any;
  providerName: string;
}

export interface UserData {
  data: Data;
  token: Token;
  provider: Provider;
}
