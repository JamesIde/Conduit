import { Articles } from "../types/Article";
import baseClient from "./baseClient";

export async function getArticles(): Promise<Articles> {
  const { data } = await baseClient.get("/articles");
  console.log("response from api.tsx", data);
  return data;
}
