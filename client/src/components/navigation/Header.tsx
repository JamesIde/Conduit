import { Link } from "react-router-dom";
import { useStore } from "../../utils/store/globalStore";
import { BsPencilSquare } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import baseAPI from "../../utils/api/api";
function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useStore((state) => state.currentUser);

  const handleProfilePrefetch = (username: string) => {
    queryClient.prefetchQuery(["profile", username], () => {
      return baseAPI.getProfile(username);
    });
    navigate(`/profile/${username}`);
  };
  return (
    <div className="xl:max-w-5xl md:max-w-4xl w-full mx-auto pt-1">
      <div className="flex flex-row justify-between">
        <div>
          <Link to="/">
            <h1 className="font-bold text-[#5CB85C] font-tilly text-[1.5rem] text-2xl p-2 cursor-pointer">
              conduit
            </h1>
          </Link>
        </div>
        <div className="flex flex-row">
          {user ? (
            <>
              <Link to="/article/new">
                <div className="flex flex-row text-gray-400 cursor-pointer hover:text-gray-600 p-2">
                  <p className="mt-[5px] mr-1">
                    <BsPencilSquare size={14} />
                  </p>
                  <p>New Article</p>
                </div>
              </Link>
              <div
                className="flex flex-row text-gray-400 cursor-pointer hover:text-gray-600 p-2"
                onClick={() => handleProfilePrefetch(user.user.username)}
              >
                <p className="mt-1 mr-1">
                  <img
                    src={user.user.image}
                    alt={user.user.username}
                    className="object-fit h-6 rounded"
                  />
                </p>
                <p className="">{user.user.username}</p>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <p className="text-gray-400 hover:text-gray-900 hover:duration-500 p-2 cursor-pointer">
                  Sign in
                </p>
              </Link>
              <Link to="/register">
                <p className="text-gray-400 hover:text-gray-900 duration-500 p-2 cursor-pointer">
                  Sign up
                </p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
