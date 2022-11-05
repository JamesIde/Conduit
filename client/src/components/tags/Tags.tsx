import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Error from "../helper/Error";
import baseAPI from "../../config/api";
import { PopularTags } from "../../types/Article";
import { APIError } from "../../types/Error";
import TagItem from "./TagItem";

function Tags() {
  const {
    data: tags,
    isLoading,
    isError,
    error = {} as AxiosError,
  } = useQuery<PopularTags, AxiosError>(["tags"], baseAPI.getTags, {
    refetchOnWindowFocus: false,
  });

  if (error) {
    return <Error error={error as AxiosError<APIError>} />;
  }

  return (
    <div className="xl:w-[30%] md:w-[30%] w-full border-2 p-3 bg-[#f3f3f3] rounded h-max">
      <p>Popular Tags</p>
      {isLoading && <p>Loading tags...</p>}
      <>
        {tags?.tags.map((tag) => {
          return <TagItem tag={tag} key={tag} />;
        })}
      </>
    </div>
  );
}
export default Tags;
