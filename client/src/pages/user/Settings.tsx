import { FormEvent, useState } from "react";
import { useIsFileUploadStore, useStore } from "../../utils/store/globalStore";
import { useMutation } from "@tanstack/react-query";
import { Profile, UpdateProfile, UpdateProfileSuccess } from "../../types/User";
import { AxiosError } from "axios";
import { APIError } from "../../types/Error";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/navigation/Logout";
import Error from "../../components/helper/Error";
import baseAPI from "../../utils/api/api";
import toast from "react-hot-toast";
import UserProfileUpload from "../../components/user/UserProfileUpload";
function Settings() {
  const navigate = useNavigate();
  const [isDirty, setIsDirty] = useState(true);
  const [currentUser, updateUser] = useStore((state) => [
    state.currentUser,
    state.updateUser,
  ]);

  const isFileUpload = useIsFileUploadStore((state) => state.isFileUpload);

  const notify = () => toast.success("Profile updated successfully!");
  const {
    mutate,
    isLoading,
    isError,
    isSuccess,
    error = {} as AxiosError,
  } = useMutation(["updateProfile"], baseAPI.updateUser, {
    onSuccess: (data: UpdateProfileSuccess) => {
      const user: Profile = JSON.parse(localStorage.getItem("user"));
      user.data = data;
      updateUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setTimeout(() => {
        navigate("/");
      }, 1000);
      notify();
    },
  });

  const user = {
    image_url: currentUser.data.image_url,
    email: currentUser.data.email,
    bio: currentUser.data.bio,
    socialLogin: currentUser.provider.socialLogin ? true : false,
  };

  const [fields, setFields] = useState({ ...user });

  const handleUpdate = (e) => {
    // Update the fields form state
    setFields((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle submit for email, bio
  const handleSubmit = (e) => {
    e.preventDefault();

    let data: UpdateProfile;

    if (currentUser.provider.socialLogin) {
      data = {
        bio: fields.bio,
      };
    } else {
      data = {
        email: fields.email,
        bio: fields.bio,
      };
    }
    mutate(data);
  };

  const handleFormInput = (e) => {
    setIsDirty(false);
  };

  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-center text-4xl xl:mt-8 md:mt-6 mt-4 mb-4">
          Your Settings
        </h1>
        <div className="mb-2">
          <div>{/*  */}</div>
          <div className="flex justify-center text-sm">
            {isError && <Error error={error as AxiosError<APIError>} />}
          </div>
        </div>

        <div className="mx-auto flex justify-center">
          <img
            src={
              user.image_url
                ? user.image_url
                : "https://api.realworld.io/images/demo-avatar.png"
            }
            alt={user.image_url}
            className="w-[125px] object-cover rounded-full"
          />
        </div>
        <UserProfileUpload />
        <form onSubmit={handleSubmit} onKeyDown={handleFormInput}>
          <textarea
            className="p-2 w-full border-[1px] border-gray-300 rounded-md mb-4"
            rows={7}
            placeholder={
              fields.bio ? fields.bio : "Write a short bio about yourself"
            }
            onChange={handleUpdate}
            name="bio"
            value={fields.bio}
          />
          <input
            className="p-2 w-full border-[1px] border-gray-300 rounded-md mb-1"
            onChange={handleUpdate}
            name="email"
            value={fields.email}
            hidden={user.socialLogin}
          />
          <div className="flex justify-end">
            <button
              style={{
                backgroundColor: isFileUpload || isDirty ? "#ccc" : "#28a745",
                cursor: isFileUpload || isDirty ? "not-allowed" : "pointer",
              }}
              type="submit"
              disabled={isFileUpload || isDirty}
              className="p-3 bg-[#5CB85C] hover:bg-[#1e6d1e] duration-500 w-max hover:cursor-pointer text-white font-bold rounded"
            >
              Update Settings
            </button>
            {isFileUpload}
          </div>
          <hr className="mt-3 mb-3" />
          <Logout />
        </form>
      </div>
    </div>
  );
}
export default Settings;
