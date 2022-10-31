import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { HiOutlinePlusSm } from "react-icons/hi";
import { useParams } from "react-router-dom";
import AuthorThumbnail from "../../components/articles/Author";
import FavouriteArticleButton from "../../components/articles/FavouriteArticleButton";
import baseAPI from "../../config/api";

import { Article } from "../../types/Article";
function ViewArticle() {
  const { slug } = useParams<{ slug: string }>();

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
                  <FavouriteArticleButton article={article} feed={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default ViewArticle;
