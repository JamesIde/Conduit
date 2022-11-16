import { Link } from "react-router-dom";
import { Article } from "../../types/Article";
import Tags from "../tags/Tags";
import AuthorThumbnail from "./AuthorThumbnail";
import FavouriteArticleButton from "./FavouriteArticleButton";
const parse = require("html-react-parser");
function ArticlePreview({
  article,
  isProfile,
}: {
  article: Article;
  isProfile: boolean;
}) {
  return (
    <div className="p-2 xl:h-[320px] md:h-[320px] h-[400px] mb-2">
      <section id="article-heading">
        <div className="flex flex-row justify-between">
          <div>
            <AuthorThumbnail
              article={article}
              size={35}
              fontColor={"#5CB85C"}
              fontSize={"13px"}
            />
          </div>
          <div className="pt-1">
            <FavouriteArticleButton
              article={article}
              feed={true}
              isProfile={isProfile}
            />
          </div>
        </div>
      </section>
      <section id="article-information">
        <div>
          <Link to={`/article/${article.slug}`}>
            <h3 className="font-bold text-2xl pt-2 text-gray-700 hover:text-black">
              {article.title}
            </h3>
          </Link>
          <div>
            <p className="italic text-gray-500 mt-2 mb-2">
              {article.description}
            </p>
            <div className="h-[120px]">
              {parse(article.body.slice(0, 180))} ...{" "}
            </div>
          </div>
        </div>
      </section>
      <section id="article-metadata">
        <div className="flex xl:flex-row md:flex-row flex-col justify-between mt-4">
          <div>
            <Link to={`/article/${article.slug}`}>
              <p className="text-gray-500 text-sm xl:text-right md:text-right text-center pb-1 hover:text-[#5CB85C] hover:duration-500">
                Read more...
              </p>
            </Link>
          </div>
          <div>
            {article.tags.slice(0, 3).map((tag) => (
              <div
                className="inline-block px-2 py-[2px] rounded text-black m-[2px] text-sm border-[1px] border-[#abafb3]"
                key={tag.charAt(0)}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </section>
      <hr className="mt-3" />
    </div>
  );
}
export default ArticlePreview;
