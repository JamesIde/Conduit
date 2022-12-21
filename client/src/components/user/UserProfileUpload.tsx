import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useIsFileUploadStore, useStore } from "../../utils/store/globalStore";
import baseAPI from "../../utils/api/api";
import { Profile } from "../../types/User";
function UserProfileUpload() {
  const updateUser = useStore((state) => state.updateUser);
  const [isFileUpload, updateIsFileUpload] = useIsFileUploadStore((state) => [
    state.isFileUpload,
    state.updateIsFileUpload,
  ]);
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const notify = () => toast.success("Profile image updated successfully!");
  const {
    mutate,
    isError,
    error = {} as AxiosError,
  } = useMutation(["updateProfileImage"], baseAPI.updateProfileImage, {
    onSuccess: (data) => {
      notify();
      handleInputReset();
      updateIsFileUpload(false);
      const user: Profile = JSON.parse(localStorage.getItem("user"));
      user.data = data;
      updateUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    },
    onError: (error: AxiosError) => {
      toast.error(error.message);
      inputRef.current.value = null;
    },
  });

  const handleInputReset = () => {
    inputRef.current.value = null;
    setFile(null);
    updateIsFileUpload(false);
  };

  // Logic to submit the image to backend
  const handleProfileUpload = (e) => {
    e.preventDefault();
    // Update global store
    updateIsFileUpload(true);

    if (file.size > 1000000) {
      toast.error("Image size must be less than 1MB");
      handleInputReset();
    } else if (file.type !== "image/jpeg" && file.type !== "image/png") {
      toast.error("Image must be a jpeg, jpg, or png");
      handleInputReset();
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      mutate(formData);
    }
  };

  return (
    <>
      <form onSubmit={handleProfileUpload}>
        <div className="flex justify-evenly mt-3">
          <div className="mb-1 w-full">
            <input
              className="form-control
              block w-full p-1 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-30 
              rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              type="file"
              ref={inputRef}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className=" text-white rounded p-2 mb-3 ml-2"
            style={{
              backgroundColor: file ? "rgb(37 99 235)" : "red",
              cursor: file ? "pointer" : "not-allowed",
            }}
            disabled={isFileUpload ? true : !file}
          >
            {isFileUpload ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
      <p className="text-xs italic text-gray-400 ml-1 mb-3">
        jpg, jpeg, png accepted. Max size 1mb
      </p>
    </>
  );
}
export default UserProfileUpload;
