// import "quill/dist/quill.snow.css";
import { useRef, useState } from "react";
import { NewArticle } from "../../types/Article";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIError } from "../../types/Error";
import { AxiosError } from "axios";
import Error from "../../components/helper/Error";
import baseAPI from "../../utils/api/api";
import { useNavigate } from "react-router-dom";
import { useQuill } from "react-quilljs";
function CreateArticle() {
  const { quill, quillRef } = useQuill();
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
    setFields((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      !fields.title ||
      !fields.description ||
      !quillRef.current.firstChild.innerHTML
    ) {
      setIsInvalid(true);
      setErrorTimeout();
      return;
    } else {
      const article: NewArticle = {
        title: fields.title,
        description: fields.description,
        body: quillRef.current.firstChild.innerHTML,
        tags: tags,
      };
      mutate(article);
    }
  };

  const { mutate, isLoading, isError, error } = useMutation(
    ["createArticle"],
    baseAPI.createArticle,
    {
      onSuccess: (data) => {
        clearFields();
        navigate(`/article/${data.slug}`);
      },
    }
  );

  const handleTagInput = (e) => {
    if (e.key === "Enter") {
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
      <div className="max-w-3xl mx-auto p-2">
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
              className="w-[95%] p-2 border-[1px] rounded mt-4 mx-auto block"
              placeholder="Title"
              onChange={handleUpdate}
              name="title"
              required
            />
            <input
              type="text"
              className="w-[95%] p-2 border-[1px] rounded mt-4 mb-4 mx-auto block"
              placeholder="A quick summary of the article"
              onChange={handleUpdate}
              name="description"
              required
            />

            <div className="ql-editor">
              <div ref={quillRef} />
            </div>
            <input
              type="text"
              className="w-[95%] p-2 border-[1px] rounded mt-4 mb-2 mx-auto block"
              placeholder="Tags"
              onKeyDown={handleTagInput}
              name="tags"
              ref={ref}
              required
            />
            <p className="text-red-500 text-sm">
              {isTagListFull && <p>Maximum six tags allowed</p>}
            </p>
            <div className="mb-1 ml-4">
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
              className="mx-auto flex justify-center bg-green-600 hover:bg-green-800 duration-500  hover:cursor-pointer p-1 rounded  text-center font-bold text-white w-[95%]"
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
