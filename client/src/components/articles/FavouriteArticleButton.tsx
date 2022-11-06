import { AiFillHeart } from "react-icons/ai";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { APIError } from "../../types/Error";
import { Article } from "../../types/Article";
import { useNavigate } from "react-router-dom";
import baseAPI from "../../config/api";
import { useStore } from "../store/userStore";
import { toast } from "react-toastify";

function FavouriteArticleButton({
  article,
  feed,
  isProfile,
}: {
  article: Article;
  feed: boolean;
  isProfile: boolean;
}) {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [APIError, setAPIError] = useState(false);
  const { mutate, error = {} as AxiosError<APIError> } = useMutation(
    ["favouriteArticle", article.slug],
    baseAPI.favouriteArticle,
    {
      onSuccess: (data) => {
        setIsProcessing(false);
        queryClient.invalidateQueries(["articles"]);
        queryClient.invalidateQueries(["article"]);
        // queryClient.refetchQueries(["articles"]);
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

  const notify = () =>
    toast.error("You can't favourite your own article!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const handleFavourite = (slug: string, isFavourited: boolean) => {
    // TODO Pagination of all articles (make it reusable)
    if (!currentUser) {
      navigate("/login");
    } else {
      if (article.author.username === currentUser.user.username) {
        notify();
      } else {
        setIsProcessing((prevState) => !prevState);
        const metadata = {
          slug,
          isFavourited,
        };
        mutate(metadata);
      }
    }
  };
  return (
    <>
      {
        <>
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
                      {article.isFavourited ? "Unfavourite" : "Favourite"}{" "}
                      article ({article.favouriteCount})
                    </div>
                  </div>
                </>
              )}
            </div>
          </button>
        </>
      }
    </>
  );
}
export default FavouriteArticleButton;

/**
 * <>
          <button
            className="h-min border-[1px] border-[#5CB85C] rounded pr-1 hover:cursor-pointer hover:border-green-900 hover:duration-500"
            style={{
              color: article.isFavourited ? "white" : "#5CB85C",
              backgroundColor: article.isFavourited ? "#5CB85C" : "transparent",
              cursor: "not-allowed",
            }}
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
                      {article.isFavourited ? "Unfavourite" : "Favourite"}{" "}
                      article ({article.favouriteCount})
                    </div>
                  </div>
                </>
              )}
            </div>
          </button>
        </>
 */
