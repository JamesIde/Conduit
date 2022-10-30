import { FavouriteStatus, Filters, GetArticles } from "../types/Article";
import {
  SignIn,
  UpdateProfile,
  UpdateProfileSuccess,
  UserSignInSuccess,
} from "../types/User";
import { PopularTags } from "../types/Article";
import baseClient from "./baseClient";
import { NewArticle, Article } from "../types/Article";

/**
           _____ _______ _____ _____ _      ______  _____ 
     /\   |  __ \__   __|_   _/ ____| |    |  ____|/ ____|
    /  \  | |__) | | |    | || |    | |    | |__  | (___  
   / /\ \ |  _  /  | |    | || |    | |    |  __|  \___ \ 
  / ____ \| | \ \  | |   _| || |____| |____| |____ ____) |
 /_/    \_\_|  \_\ |_|  |_____\_____|______|______|_____/ 
                                                                                                           
 */

async function getArticles(filters: Filters): Promise<GetArticles> {
  let url = "/articles";
  if (filters.feed) {
    url += `/feed`;
  }
  const { data } = await baseClient.get(url, {
    params: { ...filters },
  });
  console.log("articles", { data });
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
    ({ data } = await baseClient.post(`/articles/${metadata.slug}/favourite`));
  }
  return data;
}

async function getTags(): Promise<PopularTags> {
  const { data } = await baseClient.get("/articles/popular/tags");
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

async function signInUser(userData: SignIn): Promise<UserSignInSuccess> {
  const { data } = await baseClient.post("/auth/login", userData);
  return data;
}

async function updateUser(
  userData: UpdateProfile
): Promise<UpdateProfileSuccess> {
  const { data } = await baseClient.put("/auth/profile", userData);
  return data;
}

const baseAPI = {
  getArticles,
  createArticle,
  favouriteArticle,
  getTags,
  signInUser,
  updateUser,
};
export default baseAPI;
