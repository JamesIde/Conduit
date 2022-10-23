import { useQueryClient, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getArticles } from "../config/api";
import { Articles } from "../types/Article";
import Error from "../components/Error";
function Home() {
  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    error = {} as AxiosError,
    data: articles,
  } = useQuery<Articles, AxiosError>(["articles"], getArticles, {});

  if (isLoading)
    return (
      <>
        <h1>loading...</h1>
      </>
    );

  if (error) {
    return <Error error={error} />;
  }
  return (
    <div className="App">
      <div>
        {articles?.articles.map((article: any) => {
          return (
            <>
              <p>Title: {article.title}</p>
              <p>Hello</p>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
