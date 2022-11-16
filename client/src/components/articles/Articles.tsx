import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Error from "../helper/Error";
import baseAPI from "../../config/api";
import { Filters, GetArticles } from "../../types/Article";
import { APIError } from "../../types/Error";
import ArticlePreview from "./ArticlePreview";
import Paginate from "../pagination/Paginate";

function Articles({ filters }: { filters: Filters }) {
  const {
    isLoading,
    isSuccess,
    isError,
    refetch,
    error = {} as AxiosError,
    data: articles,
  } = useQuery<GetArticles, AxiosError>(
    ["articles", filters],
    () => baseAPI.getArticles(filters),
    {
      refetchOnWindowFocus: false,
      // enabled: false,
    }
  );

  console.log("the article", articles);
  return (
    <div className="xl:w-[70%] md:w-[70%] w-full">
      {isError && <p className="text-sm text-red-500">An error occured</p>}
      {isSuccess && !articles.articles.length && (
        <p className="p-1 mt-3 text-gray-500">No articles found...</p>
      )}
      {isSuccess &&
        articles?.articles.map((article) => {
          return (
            <ArticlePreview
              article={article}
              key={article.id}
              isProfile={filters.isProfile}
            />
          );
        })}
      {isSuccess &&
        (articles.metadata && articles.articles.length > 0 ? (
          <Paginate metadata={articles.metadata} />
        ) : null)}
    </div>
  );
}

export default Articles;
