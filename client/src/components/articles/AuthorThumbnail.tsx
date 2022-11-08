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

  const redirectToAuthor = (username: string) => {
    queryClient.refetchQueries(["profile", username]);
    navigate(`/profile/${username}`);
  };

  return (
    <div className="flex flex-row">
      <div>
        <div
          onClick={() => redirectToAuthor(article.author.username)}
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
          onClick={() => redirectToAuthor(article.author.username)}
          className="hover:cursor-pointer hover:text-[#5CB85C]"
        >
          <p className="pt-1 font-medium hover:text-[#5CB85C] hover:duration-500">
            {article.author.username}
          </p>
        </div>
        <p
          className="text-black"
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
