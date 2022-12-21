import { FavouriteStatus, Filters } from "../../types/Article";
import {
  FollowMetadata,
  Profile,
  LoginUser,
  RegisterUser,
  UpdateProfile,
  UpdateProfileSuccess,
  UserSignInSuccess,
} from "../../types/User";
import { PopularTags } from "../../types/Article";
import { NewArticle, Article } from "../../types/Article";
import { UserProfile } from "../../types/Profile";
import baseClient from "./baseClient";

/**
           _____ _______ _____ _____ _      ______  _____ 
     /\   |  __ \__   __|_   _/ ____| |    |  ____|/ ____|
    /  \  | |__) | | |    | || |    | |    | |__  | (___  
   / /\ \ |  _  /  | |    | || |    | |    |  __|  \___ \ 
  / ____ \| | \ \  | |   _| || |____| |____| |____ ____) |
 /_/    \_\_|  \_\ |_|  |_____\_____|______|______|_____/ 
                                                                                                           
 */

async function getArticles(filters: Filters): Promise<any> {
  let url = "articles/";
  if (filters.feed) {
    url += `feed`;
  }
  if (filters.author) {
    url += `author/${filters.author}`;
  }
  if (filters.favourited) {
    url += "user/favourites";
  }
  const { data } = await baseClient.get(url, {
    params: { ...filters },
  });
  return data;
}

async function createArticle(articleData: NewArticle): Promise<Article> {
  const { data } = await baseClient.post("/articles", articleData);
  return data;
}

async function favouriteArticle(metadata: FavouriteStatus): Promise<Article> {
  let data: any;
  if (metadata.isFavourited) {
    ({ data } = await baseClient.delete(
      `/articles/${metadata.slug}/favourite`
    ));
  } else {
    ({ data } = await baseClient.post(`articles/${metadata.slug}/favourite`));
  }
  return data;
}

async function getTags(): Promise<PopularTags> {
  const { data } = await baseClient.get("articles/popular/tags");
  return data;
}

async function getArticleBySlug(slug: string): Promise<Article> {
  const { data } = await baseClient.get(`articles/${slug}`);
  return data;
}

/**
 *______ ____  _      _      ______          __  _    _  _____ ______ _____  
 |  ____/ __ \| |    | |    / __ \ \        / / | |  | |/ ____|  ____|  __ \ 
 | |__ | |  | | |    | |   | |  | \ \  /\  / /  | |  | | (___ | |__  | |__) |
 |  __|| |  | | |    | |   | |  | |\ \/  \/ /   | |  | |\___ \|  __| |  _  / 
 | |   | |__| | |____| |___| |__| | \  /\  /    | |__| |____) | |____| | \ \ 
 |_|    \____/|______|______\____/   \/  \/      \____/|_____/|______|_|  \_\
                                                                                                                                                        
 */

async function handleFollowUser(metadata: FollowMetadata): Promise<any> {
  let data: any;
  if (!metadata.isFollowed) {
    ({ data } = await baseClient.post(
      `/identity/profile/${metadata.username}/follow`
    ));
  } else {
    ({ data } = await baseClient.delete(
      `identity/profile/${metadata.username}/follow`
    ));
  }
  return data;
}

async function unfollowUser(username: string): Promise<any> {
  const { data } = await baseClient.delete(
    `identity/profile/${username}/follow`
  );
  return data;
}

/**
 *_    _  _____ ______ _____  
 | |  | |/ ____|  ____|  __ \ 
 | |  | | (___ | |__  | |__) |
 | |  | |\___ \|  __| |  _  / 
 | |__| |____) | |____| | \ \ 
  \____/|_____/|______|_|  \_\                        
 */

async function signInUser(userData: LoginUser): Promise<Profile> {
  const { data } = await baseClient.post("identity/login", userData);
  return data;
}

async function signUpUser(userData: RegisterUser): Promise<Profile> {
  const { data } = await baseClient.post("identity/register", userData);
  return data;
}

async function updateUser(
  userData: UpdateProfile
): Promise<UpdateProfileSuccess> {
  const { data } = await baseClient.put("identity/profile", userData);
  return data;
}

async function getProfile(username: string): Promise<UserProfile> {
  const { data } = await baseClient.get(`identity/profile/${username}`);
  return data;
}

async function logoutUser(): Promise<any> {
  const { data } = await baseClient.get("identity/revoke_token");
  return data;
}

async function updateProfileImage(file: FormData): Promise<any> {
  const { data } = await baseClient.post("uploadfile", file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

/**
  _____ _____  ______ _   _ _______ _____ _________     __  _____  _____   ______      _______ _____  ______ _____  
 |_   _|  __ \|  ____| \ | |__   __|_   _|__   __\ \   / / |  __ \|  __ \ / __ \ \    / /_   _|  __ \|  ____|  __ \ 
   | | | |  | | |__  |  \| |  | |    | |    | |   \ \_/ /  | |__) | |__) | |  | \ \  / /  | | | |  | | |__  | |__) |
   | | | |  | |  __| | . ` |  | |    | |    | |    \   /   |  ___/|  _  /| |  | |\ \/ /   | | | |  | |  __| |  _  / 
  _| |_| |__| | |____| |\  |  | |   _| |_   | |     | |    | |    | | \ \| |__| | \  /   _| |_| |__| | |____| | \ \ 
 |_____|_____/|______|_| \_|  |_|  |_____|  |_|     |_|    |_|    |_|  \_\\____/   \/   |_____|_____/|______|_|  \_\
 */

async function IdpAuthenticate(idpToken): Promise<any> {
  const { data } = await baseClient.post("identity/idp", idpToken);
  return data;
}

const baseAPI = {
  getArticles,
  getArticleBySlug,
  createArticle,
  favouriteArticle,
  getTags,
  signInUser,
  signUpUser,
  updateUser,
  getProfile,
  handleFollowUser,
  unfollowUser,
  logoutUser,
  updateProfileImage,
  IdpAuthenticate,
};
export default baseAPI;
