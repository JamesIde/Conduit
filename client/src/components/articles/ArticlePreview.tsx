import { Link } from "react-router-dom";
import { Article } from "../../types/Article";
import { AiFillHeart } from "react-icons/ai";
import { useEffect, useState } from "react";
import baseAPI from "../../config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { APIError } from "../../types/Error";
const parse = require("html-react-parser");
function ArticlePreview({ article }: { article: Article }) {
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
    setIsProcessing((prevState) => !prevState);
    console.log("slug", slug, "isfavourited", isFavourited);
    const metadata = {
      slug,
      isFavourited,
    };
    mutate(metadata);
  };

  return (
    <div className="p-2 ">
      <section id="article-heading">
        <div className="flex flex-row justify-between">
          <div>
            <div className="flex flex-row">
              <div>
                <Link to={`/profile/user/${article.author.username}`}>
                  <img
                    className="w-[35px] rounded mt-2"
                    src={
                      article.author.image
                        ? article.author.image
                        : "https://api.realworld.io/images/demo-avatar.png"
                    }
                    alt={article.author.username}
                  />
                </Link>
              </div>
              <div className="ml-2">
                <Link to={`/profile/user/${article.author.username}`}>
                  <p className="pt-1 text-[#5CB85C]">
                    {article.author.username}
                  </p>
                </Link>
                <p className="text-sm text-gray-400">
                  {new Date(article.createdAt).toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
          {APIError && (
            <p className="text-sm text-red-500">
              {error.response.data.message}
            </p>
          )}
          <button
            className="h-min border-[1px] border-[#5CB85C] rounded pr-1 hover:cursor-pointer"
            style={{
              color: article.isFavourited ? "white" : "#5CB85C",
              backgroundColor: article.isFavourited ? "#5CB85C" : "white",
              cursor: isProcessing ? "not-allowed" : "pointer",
            }}
            onClick={() => handleFavourite(article.slug, article.isFavourited)}
            disabled={isProcessing}
          >
            <div className="flex flex-row">
              <div className="p-1">
                <AiFillHeart />
              </div>
              {article.favouriteCount}
            </div>
          </button>
        </div>
      </section>
      <section id="article-information">
        <div>
          <Link to={`/article/${article.slug}`}>
            <h3 className="font-bold text-2xl pt-2 text-gray-700 hover:text-black">
              {article.title}
            </h3>
          </Link>
          <p className="italic text-gray-500 mt-2 mb-2">
            {article.description}
          </p>
          <p>{parse(article.body.slice(0, 350))} ...</p>
        </div>
      </section>
      <section id="article-metadata">
        <div className="flex flex-row justify-between mt-4">
          <div>
            <Link to={`/article/${article.slug}`}>
              <p className="text-gray-500 text-sm">Read more...</p>
            </Link>
          </div>
          <div>
            {article.tags.map((tag) => (
              <p className="inline-block px-2 py-[2px] rounded text-black m-[2px] text-sm border-[1px] border-[#abafb3]">
                {tag}
              </p>
            ))}
          </div>
        </div>
      </section>
      <hr className="mt-3 mb-3" />
    </div>
  );
}
export default ArticlePreview;
