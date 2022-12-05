import { QueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddCommentProps, AddCommentRequest } from "../../types/Comment";
import baseClient from "../../utils/api/baseClient";

function AddComment({ articleId, slug, currentUser }: AddCommentProps) {
  const queryClient = new QueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCommentRequest>();

  const onSubmit: SubmitHandler<AddCommentRequest> = async (data, e) => {
    const response = await baseClient.post(
      `/comments/${articleId}/${slug}`,
      data
    );
    if (response.status === 201) {
      reset();
      window.location.reload();
      queryClient.invalidateQueries(["article"]);
    }
  };

  return (
    <section id="article-add-comment" className="p-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-2xl border-[1px] border-t-[#E5E5E5]  border-l-[#E5E5E5] border-r-[#E5E5E5] rounded-t mx-auto mt-2 ">
          <textarea
            {...register("body", { required: true })}
            rows={3}
            className="w-full p-2"
            placeholder={
              currentUser ? "Write a comment..." : "Sign in to add a comment!"
            }
            disabled={currentUser ? false : true}
          ></textarea>
        </div>
        {errors.body && (
          <p className="text-center text-sm text-red-500">
            This field is required!
          </p>
        )}
        <div className="max-w-2xl mx-auto w-full bg-[#F5F5F5] border-b-[1px] border-r-[1px] border-l-[1px] border-b-[#E5E5E5]  border-l-[#E5E5E5] border-r-[#E5E5E5]">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row">
              <div className="p-4">
                <img
                  src={
                    currentUser?.user?.image_url
                      ? currentUser?.user?.image_url
                      : "https://api.realworld.io/images/smiley-cyrus.jpeg"
                  }
                  className="w-12 rounded-3xl"
                />
              </div>
              <div className="mt-6 text-[#5CB85C] text-md font-semibold">
                {currentUser?.user?.username}
              </div>
            </div>
            <div className="flex items-center p-4">
              <button
                className="p-2 bg-[#5CB85C] hover:bg-green-700 hover:duration-500 hover:cursor-pointer text-white font-bold rounded xl:text-md md:text-md text-sm"
                disabled={!currentUser}
                type="submit"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
export default AddComment;

// const addComment = await axios
//   .post(`http://localhost:3001/comments/${articleId}/${slug}`, data)
//   .then((res) => {
//     console.log("response received");
//     if (res.status === 200) {
//       console.log("response received");
//       reset();
//     }
//   })
//   .catch((err) => {
//     console.log(err);
//     window.alert(err.message);
//   });
