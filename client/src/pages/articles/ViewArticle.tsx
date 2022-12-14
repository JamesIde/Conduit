import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import AuthorThumbnail from "../../components/articles/AuthorThumbnail";
import FavouriteArticleButton from "../../components/articles/FavouriteArticleButton";
import AddComment from "../../components/comments/AddComment";
import { useStore } from "../../utils/store/globalStore";
import baseAPI from "../../utils/api/api";
import { Article } from "../../types/Article";
const parse = require("html-react-parser");
function ViewArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [isFetched, setIsFetched] = useState(false);
  const currentUser = useStore((state) => state.currentUser);
  const {
    isLoading,
    isError,
    error = {} as AxiosError,
    data: article,
  } = useQuery<Article, AxiosError>(
    ["article"],
    () => baseAPI.getArticleBySlug(slug),
    {
      refetchOnWindowFocus: true,
      onSuccess: (date) => {
        setIsFetched(true);
      },
    }
  );

  return (
    <div>
      <section id="article-banner">
        <div className="bg-[#f7f6f6] xl:h-[280px] md:h-[250px] h-[280px] border-b-[1px] border-b-[#b6b6b6]">
          <div className="mx-auto text-center flex justify-center items-center">
            <div className="xl:h-[200px] md:h-[150px] h-[150px] flex-col">
              <div className="text-center xl:mt-[85px] md:mt-5 mt-5">
                {isFetched && (
                  <>
                    <h3 className="font-bold xl:text-4xl md:text-3xl text-2xl text-black">
                      {article?.title}
                    </h3>
                    <p className="p-2 xl:text-xl md:text-md text-sm text-black xl:mt-5 md:mt-2">
                      {article?.description}
                    </p>
                  </>
                )}
                {isLoading && <p>Loading article...</p>}
              </div>
              <div className="flex xl:flex-row flex-col w-max mt-2 mx-auto">
                {isFetched && (
                  <>
                    <div className="mt-1 pr-4 ">
                      <AuthorThumbnail
                        article={article}
                        size={55}
                        fontColor={"#5CB85C"}
                        fontSize={"12px"}
                      />
                    </div>
                    <div className="mt-4">
                      <FavouriteArticleButton
                        article={article}
                        feed={false}
                        isProfile={false}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="article-information">
        {isFetched && (
          <>
            <div className="max-w-2xl mx-auto xl:p-0 md:p-0 p-2">
              <div className="xl:pt-10 md:pt-5 pt-3 p-3">
                {parse(article.body)}
              </div>
            </div>
            <AddComment
              articleId={article.id}
              slug={article.slug}
              currentUser={currentUser}
            />
          </>
        )}
      </section>
      <section id="article-display-comments">
        <div className="mt-6 mb-5 p-3">
          {isFetched &&
            article.comments.map((comment) => {
              return (
                <div className="mt-3" key={comment.id}>
                  <div className="max-w-2xl mx-auto p-4 border-t-[1px] border-r-[1px] border-l-[1px] border-t-[#E5E5E5]  border-l-[#E5E5E5] border-r-[#E5E5E5] rounded-t">
                    <div className="p-2">{comment.body}</div>
                  </div>
                  <div className="max-w-2xl mx-auto border-[1px] border-[#E5E5E5]">
                    <div className="bg-[#F5F5F5]">
                      <div className="flex flex-row p-4">
                        <div>
                          <img
                            src={
                              comment.author.image_url
                                ? comment.author.image_url
                                : "https://api.realworld.io/images/smiley-cyrus.jpeg"
                            }
                            className="w-10 rounded-3xl"
                          />
                        </div>
                        <div className="flex flex-row">
                          <Link to={`/profile/${comment.author.username}`}>
                            <p className="text-green-600 text-md p-2 hover:text-green-800 hover:underline hover:underline-offset-1 hover:duration-500 hover:cursor-pointer">
                              {comment.author.username}
                            </p>
                          </Link>
                          <p className="text-gray-400 text-sm mt-[10px]">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                year: "numeric",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}
export default ViewArticle;
