import { Filters, GetArticles } from "../types/Article";
import {
  SignIn,
  UpdateProfile,
  UpdateProfileSuccess,
  UserSignInSuccess,
} from "../types/User";
import { PopularTags } from "../types/Article";
import baseClient from "./baseClient";
import { NewArticle, Article } from "../types/Article";

async function getArticles(filters: Filters): Promise<GetArticles> {
  let url = "/articles";
  if (filters.feed) {
    url += `/feed`;
  }
  const { data } = await baseClient.get(url, {
    params: { ...filters },
  });
  console.log("articles", data);
  return data;
}

async function createArticle(articleData: NewArticle): Promise<Article> {
  const { data } = await baseClient.post("/articles", articleData);
  return data;
}

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

async function getTags(): Promise<PopularTags> {
  const { data } = await baseClient.get("/articles/popular/tags");
  return data;
}

const baseAPI = {
  getArticles,
  createArticle,
  signInUser,
  getTags,
  updateUser,
};
export default baseAPI;
