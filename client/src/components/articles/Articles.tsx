import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Error from "../../components/Error";
import baseAPI from "../../config/api";
import { Filters, GetArticles } from "../../types/Article";
import { APIError } from "../../types/Error";
import ArticlePreview from "./ArticlePreview";

function Articles({ filters }: { filters: Filters }) {
  const {
    isLoading,
    isSuccess,
    isError,
    error = {} as AxiosError,
    data: articles,
  } = useQuery<GetArticles, AxiosError>(
    ["articles", filters],
    () => baseAPI.getArticles(filters),
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="xl:w-[70%] md:w-[70%] w-full">
      {isLoading && <p>Loading articles...</p>}
      {isError && <Error error={error as AxiosError<APIError>} />}
      {isSuccess && !articles?.articles.length && <p>No articles found</p>}
      {isSuccess &&
        articles?.articles.map((article) => {
          return <ArticlePreview article={article} key={article.slug} />;
        })}
    </div>
  );
}

export default Articles;
