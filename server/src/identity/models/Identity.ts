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
