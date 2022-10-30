import { useNavigate } from "react-router-dom";
import { useStore } from "../store/userStore";

function Logout() {
  const navigate = useNavigate();
  const [currentUser, removeUser] = useStore((state) => [
    state.currentUser,
    state.removeUser,
  ]);
  const handleClick = (e) => {
    removeUser();
    localStorage.removeItem("user");
    navigate("/");
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
