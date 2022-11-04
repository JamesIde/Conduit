import { Article } from "../../types/Article";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const redirecToAuthor = (username: string) => {
    queryClient.invalidateQueries(["profile"]);
    navigate(`/profile/${username}`);
  };

  return (
    <div className="flex flex-row">
      <div>
        <div
          onClick={() => redirecToAuthor(article.author.username)}
          className="hover:cursor-pointer"
        >
          <img
            className="rounded mt-2"
            style={{ width: size }}
            src={
              article?.author?.image
                ? article?.author?.image
                : "https://api.realworld.io/images/demo-avatar.png"
            }
            alt={article?.author?.username}
          />
        </div>
      </div>
      <div className="ml-2">
        <div
          onClick={() => redirecToAuthor(article.author.username)}
          className="hover:cursor-pointer"
        >
          <p
            className="pt-1"
            style={{
              color: fontColor,
            }}
          >
            {article.author.username}
          </p>
        </div>
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
