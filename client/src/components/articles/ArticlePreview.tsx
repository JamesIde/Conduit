import { Link } from "react-router-dom";
import { Article } from "../../types/Article";
import AuthorThumbnail from "./AuthorThumbnail";
import FavouriteArticleButton from "./FavouriteArticleButton";
const parse = require("html-react-parser");
function ArticlePreview({ article }: { article: Article }) {
  return (
    <div className="p-2">
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
          <FavouriteArticleButton article={article} feed={true} />
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
