import { useState } from "react";
import { useStore } from "../../components/store/globalStore";
import { useMutation } from "@tanstack/react-query";
import { UpdateProfile, UserSignInSuccess } from "../../types/User";
import { AxiosError } from "axios";
import { APIError } from "../../types/Error";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/navigation/Logout";
import Error from "../../components/helper/Error";
import baseAPI from "../../config/api";
import toast from "react-hot-toast";
function Settings() {
  const navigate = useNavigate();
  const [currentUser, updateUser] = useStore((state) => [
    state.currentUser,
    state.updateUser,
  ]);

  const notify = () => toast.success("Profile updated successfully!");

  const {
    mutate,
    isLoading,
    isError,
    isSuccess,
    error = {} as AxiosError,
  } = useMutation(["updateProfile"], baseAPI.updateUser, {
    onSuccess: (data) => {
      const oldUser = JSON.parse(localStorage.getItem("user"));
      oldUser.user = data;
      const newUser = oldUser;
      updateUser(newUser);
      navigate("/");
      notify();
    },
  });
  const user = {
    image: currentUser.user.image,
    email: currentUser.user.email,
    bio: currentUser.user.bio,
  };

  const [fields, setFields] = useState({ ...user });

  const handleUpdate = (e) => {
    // Update the fields form state
    setFields((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data: UpdateProfile = {
      ...fields,
    };
    mutate(data);
  };

  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-center text-4xl xl:mt-8 md:mt-6 mt-4 mb-4">
          Your Settings
        </h1>
        <div className="mb-2">
          <div>
            {isLoading && (
              <p className="text-center text-sm">Updating your profile...</p>
            )}
          </div>
          <div>{/*  */}</div>
          <div className="flex justify-center text-sm">
            {isError && <Error error={error as AxiosError<APIError>} />}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="p-2 w-full border-[1px] border-gray-300 rounded-md mb-4"
            onChange={handleUpdate}
            name="image"
            value={fields.image}
          />
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
            className="p-2 w-full border-[1px] border-gray-300 rounded-md mb-4"
            onChange={handleUpdate}
            name="email"
            value={fields.email}
          />
          <div className="flex justify-end">
            <button type="submit">
              <p className="p-3 bg-green-600 hover:bg-green-800 duration-500 w-max hover:cursor-pointer text-white font-bold rounded">
                Update Settings
              </p>
            </button>
          </div>
          <hr className="mt-3 mb-3" />
          <Logout />
        </form>
      </div>
    </div>
  );
}
export default Settings;
