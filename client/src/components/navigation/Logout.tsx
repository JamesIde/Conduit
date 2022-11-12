import { useNavigate } from "react-router-dom";
import baseAPI from "../../config/api";
import { useStore } from "../store/userStore";

import { toast } from "react-toastify";
function Logout() {
  const navigate = useNavigate();
  const [currentUser, removeUser] = useStore((state) => [
    state.currentUser,
    state.removeUser,
  ]);
  const handleClick = async (e) => {
    // Revokes the refresh token
    await baseAPI
      .logoutUser()
      .then((res) => {
        removeUser();
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <p
        className="p-2 border-[1px] text-red-700 border-red-800 hover:bg-red-800 duration-500 w-min hover:cursor-pointer rounded hover:text-white font-bold"
        onClick={handleClick}
      >
        Logout
      </p>
    </>
  );
}
export default Logout;
