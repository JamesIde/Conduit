import { GetArticles } from "../types/Article";
import { SignIn, UserSignInSuccess } from "../types/User";
import { PopularTags } from "../types/Article";
import baseClient from "./baseClient";

async function getArticles(): Promise<GetArticles> {
  const { data } = await baseClient.get("/articles");
  console.log("response from api.tsx", data);
  return data;
}

async function signInUser(userData: SignIn): Promise<UserSignInSuccess> {
  const { data } = await baseClient.post("/auth/login", userData);
  console.log("response from sign in", data);
  return data;
}

async function getTags(): Promise<PopularTags> {
  const { data } = await baseClient.get("/articles/popular/tags");
  console.log("response for tags", data);
  return data;
}

const baseAPI = {
  getArticles,
  signInUser,
  getTags,
};
export default baseAPI;
