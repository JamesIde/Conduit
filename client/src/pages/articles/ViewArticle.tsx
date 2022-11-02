import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { HiOutlinePlusSm } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import AuthorThumbnail from "../../components/articles/AuthorThumbnail";
import FavouriteArticleButton from "../../components/articles/FavouriteArticleButton";
import { useStore } from "../../components/store/userStore";
import baseAPI from "../../config/api";
import { Article } from "../../types/Article";
const parse = require("html-react-parser");
function ViewArticle() {
  const { slug } = useParams<{ slug: string }>();
  const currentUser = useStore((state) => state.currentUser);
  const {
    isLoading,
    isSuccess,
    isError,
    error = {} as AxiosError,
    data: article,
  } = useQuery<Article, AxiosError>(["article"], () =>
    baseAPI.getArticleBySlug(slug)
  );

  return (
    <div>
      <section id="article-banner">
        <div className="bg-[#333] xl:h-[290px] md:h-[250px] h-[220px]">
          <div className="mx-auto text-center flex justify-center items-center">
            <div className="xl:h-[200px] md:h-[150px] h-[150px] flex-col">
              <div className="text-center xl:mt-28 md:mt-16 mt-10">
                <div>
                  {isLoading && (
                    <p className="text-white text-center">Loading...</p>
                  )}
                </div>
                <h3 className="font-bold text-4xl text-white">
                  {article?.title}
                </h3>
                <p className="text-md font-bold text-white xl:mt-5 md:mt-2 mt-2">
                  {article?.description}
                </p>
              </div>
              <div className="flex flex-row xl:w-[650px] md:w-[500px] w-full mt-4">
                <div className="mt-1 pr-4 ">
                  {isSuccess && (
                    <AuthorThumbnail
                      article={article}
                      size={55}
                      fontColor={"white"}
                      fontSize={"12px"}
                    />
                  )}
                </div>
                <div className="mt-3 pr-2">
                  <div className="flex flex-row text-gray-400 cursor-pointer p-1 font-medium text-sm border-[1px] border-gray-400 rounded hover:bg-gray-300 hover:text-white hover:duration-500">
                    <p className="mr-1 ">
                      <HiOutlinePlusSm size={20} />
                    </p>
                    <p>Follow User</p>
                  </div>
                </div>
                <div className="mt-3">
                  {isSuccess && (
                    <FavouriteArticleButton article={article} feed={false} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="article-information">
        {isSuccess && (
          <>
            <div className="max-w-2xl border-2 mx-auto">
              <div className="text-center font-bold text-2xl mt-4">
                {article.title}
              </div>
              <div className="pt-2 p-2">{parse(article.body)}</div>
            </div>
          </>
        )}
      </section>
      <section id="article-add-comment">
        <div className="max-w-2xl border-[1px] border-t-[#E5E5E5]  border-l-[#E5E5E5] border-r-[#E5E5E5] rounded-t mx-auto mt-2">
          <textarea
            name=""
            id=""
            rows={3}
            className="w-full p-2"
            placeholder="Write a comment..."
          ></textarea>
        </div>
        <div className="max-w-2xl mx-auto w-full bg-[#F5F5F5] border-b-[1px] border-r-[1px] border-l-[1px] border-b-[#E5E5E5]  border-l-[#E5E5E5] border-r-[#E5E5E5]">
          <div className="flex flex-row justify-between">
            <div className="p-4">
              <img
                src={
                  currentUser?.user?.image
                    ? currentUser.user?.image
                    : "https://api.realworld.io/images/smiley-cyrus.jpeg"
                }
                className="w-12 rounded-3xl"
              />
            </div>
            <div className="flex items-center p-4">
              <button className="p-2 bg-[#5CB85C] hover:bg-green-700 hover:duration-500 hover:cursor-pointer text-white font-bold rounded">
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </section>
      <section id="article-display-comments">
        <div className="mt-6 mb-5">
          {isSuccess &&
            article.comments.map((comment) => {
              return (
                <div className="mt-3">
                  <div className="max-w-2xl mx-auto p-4 border-t-[1px] border-r-[1px] border-l-[1px] border-t-[#E5E5E5]  border-l-[#E5E5E5] border-r-[#E5E5E5] rounded-t">
                    <div className="p-2">{comment.body}</div>
                  </div>
                  <div className="max-w-2xl mx-auto border-[1px] border-[#E5E5E5]">
                    <div className="bg-[#F5F5F5]">
                      <div className="flex flex-row p-4">
                        <div>
                          <img
                            src={
                              comment.author.image
                                ? comment.author.image
                                : "https://api.realworld.io/images/smiley-cyrus.jpeg"
                            }
                            className="w-10 rounded-3xl"
                          />
                        </div>
                        <div className="flex flex-row">
                          <Link to={`/profile/${comment.author.name}`}>
                            <p className="text-green-600 text-md p-2 hover:text-green-800 hover:underline hover:underline-offset-1 hover:duration-500 hover:cursor-pointer">
                              {comment.author.name}
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
