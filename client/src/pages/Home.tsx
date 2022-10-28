import { useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import baseAPI from "../config/api";
import { Article, GetArticles } from "../types/Article";
import Error from "../components/Error";
import { APIError } from "../types/Error";
import { UserSignInSuccess } from "../types/User";
import Tags from "../components/tags/Tags";
import Articles from "../components/articles/Articles";
function Home() {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    error = {} as AxiosError,
    data: articles,
  } = useQuery<GetArticles, AxiosError>(["articles"], baseAPI.getArticles, {
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <>
        <h1>loading...</h1>
      </>
    );

  if (error) {
    return <Error error={error as AxiosError<APIError>} />;
  }
  return (
    <div className="xl:max-w-5xl md:max-w-4xl w-full mx-auto border-2 pt-1">
      <div className="flex xl:flex-row md:flex-row flex-col-reverse xl:mt-12 md:mt-10 mt-0">
        <Articles />
        <Tags />
      </div>
    </div>
  );
}

export default Home;
{
  /* <div>
        {articles?.articles.map((article: Article) => {
          return (
            <>
              <p>Title: {article.title}</p>
              <p>Hello</p>
            </>
          );
        })}
      </div> */
}
