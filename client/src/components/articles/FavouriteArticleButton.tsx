import { AiFillHeart } from "react-icons/ai";
import { useState } from "react";
import baseAPI from "../../config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { APIError } from "../../types/Error";
import { Article } from "../../types/Article";

function FavouriteArticleButton({
  article,
  feed,
}: {
  article: Article;
  feed: boolean;
}) {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [APIError, setAPIError] = useState(false);
  const {
    mutate,
    isLoading,
    isSuccess,
    isError,
    error = {} as AxiosError<APIError>,
  } = useMutation(
    ["favouriteArticle", article.slug],
    baseAPI.favouriteArticle,
    {
      onSuccess: (data) => {
        setIsProcessing(false);
        queryClient.invalidateQueries(["articles"]);
        queryClient.invalidateQueries(["article"]);
      },
      onError: (error: AxiosError<APIError>) => {
        setIsProcessing(false);
        setAPIError(true);
        setTimeout(() => {
          setAPIError(false);
        }, 3000);
      },
    }
  );

  const handleFavourite = (slug: string, isFavourited: boolean) => {
    // TODO prevent user favouriting article before mutation
    // TODO prevent not logged in user from favouriting
    // TODO register
    // TODO Tag context for tag filtering (backend needs fixing too)
    setIsProcessing((prevState) => !prevState);
    const metadata = {
      slug,
      isFavourited,
    };
    mutate(metadata);
  };
  return (
    <button
      className="h-min border-[1px] border-[#5CB85C] rounded pr-1 hover:cursor-pointer hover:border-green-900 hover:duration-500"
      style={{
        color: article.isFavourited ? "white" : "#5CB85C",
        backgroundColor: article.isFavourited ? "#5CB85C" : "transparent",
        cursor: isProcessing ? "not-allowed" : "pointer",
      }}
      onClick={() => handleFavourite(article.slug, article.isFavourited)}
    >
      <div className="flex flex-row">
        {feed ? (
          <>
            <div className="p-1">
              <AiFillHeart />
            </div>
            {article.favouriteCount}
          </>
        ) : (
          <>
            <div className="p-1 flex flex-row ">
              <div className="pt-1 pr-1">
                <AiFillHeart />
              </div>
              <div className="font-medium text-sm">
                {article.isFavourited ? "Unfavourite" : "Favourite"} article (
                {article.favouriteCount})
              </div>
            </div>
          </>
        )}
      </div>
    </button>
  );
}
export default FavouriteArticleButton;
