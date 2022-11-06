import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRef, useState } from "react";
import { NewArticle } from "../../types/Article";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIError } from "../../types/Error";
import { AxiosError } from "axios";
import Error from "../../components/helper/Error";
import baseAPI from "../../config/api";
import { redirect, useNavigate } from "react-router-dom";
function CreateArticle() {
  const queryClient = useQueryClient();
  const ref = useRef(null);
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isTagListFull, setIsTagListFull] = useState(false);
  const [fields, setFields] = useState({
    title: "",
    description: "",
    body: "",
  });
  const handleUpdate = (e) => {
    // Update the fields form state
    setFields((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  //htmlr eact parser
  const handleEditor = (value) => {
    setFields((prevState) => ({
      ...prevState,
      body: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!fields.title || !fields.description || !fields.body) {
      setIsInvalid(true);
      setErrorTimeout();
      return;
    } else {
      const article: NewArticle = {
        title: fields.title,
        description: fields.description,
        body: fields.body,
        tags: tags,
      };
      console.log(article);
      mutate(article);
    }
  };

  const { mutate, isLoading, isError, error } = useMutation(
    ["createArticle"],
    baseAPI.createArticle,
    {
      onSuccess: (data) => {
        clearFields();
        // queryClient.prefetchQuery(["article", data.slug]);
        navigate(`/article/${data.slug}`);
        console.log(data);
      },
    }
  );

  const handleTagInput = (e) => {
    if (e.key === " " || e.key === "Enter") {
      if (tags.length == 6) {
        ref.current.value = "";
        setIsTagListFull(true);
        setErrorTimeout();
      } else {
        setTags([...tags, e.target.value]);
        ref.current.value = "";
      }
    }
  };

  const setErrorTimeout = () => {
    setTimeout(() => {
      setIsInvalid(false);
      setIsTagListFull(false);
    }, 3000);
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const clearFields = () => {
    setFields({
      title: "",
      description: "",
      body: "",
    });
    setTags([]);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-center font-medium text-3xl">Create Article</h1>
        <p className="text-center text-gray-400">
          Got an interest or topic you want to talk about? Write an article
          about it!
        </p>
        <div className="text-center text-lg font-bold text-green-500">
          {isLoading && <p>Creating article...</p>}
        </div>
        <div className="text-center text-lg font-bold text-red-500">
          {isError && <Error error={error as AxiosError<APIError>} />}
        </div>
        <div className="text-center text-lg font-bold text-red-500">
          {isInvalid && <p>Please ensure all fields are populated!</p>}
        </div>
        <div className="xl:max-w-2xl md:max-w-2xl max-w-3xl mx-auto">
          <form>
            <input
              type="text"
              className="w-full p-2 border-2 rounded mt-4"
              placeholder="Title"
              onChange={handleUpdate}
              name="title"
              required
            />
            <input
              type="text"
              className="w-full p-2 border-2 rounded mt-4 mb-4"
              placeholder="A quick summary of the article"
              onChange={handleUpdate}
              name="description"
              required
            />
            <ReactQuill
              value={fields.body}
              onChange={handleEditor}
              formats
              name="body"
            />
            <input
              type="text"
              className="w-full p-2 border-2 rounded mt-4 mb-2"
              placeholder="Tags"
              onKeyDown={handleTagInput}
              name="tags"
              ref={ref}
              required
            />
            <p className="text-red-500 text-sm">
              {isTagListFull && <p>Maximum six tags allowed</p>}
            </p>
            <div className="mb-1">
              {tags &&
                tags.map((tag) => {
                  return (
                    <p
                      onClick={(e) => removeTag(tag)}
                      className="bg-[#818a91]  px-2 py-[2px] rounded text-white m-[2px] text-sm hover:cursor-pointer hover:bg-gray-600 hover:duration-500 w-min inline-block"
                    >
                      {tag}
                    </p>
                  );
                })}
            </div>
          </form>
          <div className="max-2w-xl ">
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="mx-auto flex justify-center bg-green-600 hover:bg-green-800 duration-500  hover:cursor-pointer p-1 rounded  text-center font-bold text-white w-full"
            >
              Create Article
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default CreateArticle;
