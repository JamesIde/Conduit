import { Article } from "../../types/Article";
import { Link } from "react-router-dom";
function AuthorThumbnail({
  article,
  size,
  fontSize,
  fontColor,
}: {
  article: Article;
  size: number;
  fontSize: string;
  fontColor: string;
}) {
  return (
    <div className="flex flex-row">
      <div>
        <Link to={`/profile/user/${article.author.username}`}>
          <img
            className="rounded mt-2"
            style={{ width: size }}
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
          <p
            className="pt-1"
            style={{
              color: fontColor,
            }}
          >
            {article.author.username}
          </p>
        </Link>
        <p
          className="text-gray-400"
          style={{
            fontSize: fontSize,
          }}
        >
          {new Date(article.createdAt).toLocaleString("en-US", {
            month: "long",
            year: "numeric",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
export default AuthorThumbnail;
