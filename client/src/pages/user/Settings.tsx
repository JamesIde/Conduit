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
function Settings() {
  const navigate = useNavigate();
  const [currentUser, updateUser] = useStore((state) => [
    state.currentUser,
    state.updateUser,
  ]);

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

      setTimeout(() => {
        navigate("/");
      }, 1500);
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
  // Use mutation to update user, destructure mutate, call it on handleUpdate

  return (
    <div className="p-4">
      {/* <p>This is settings page for {user.user.username}</p> */}
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
          <div>
            {isSuccess && (
              <p className="text-green-500 text-center">
                Profile settings updated!
              </p>
            )}
          </div>
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
