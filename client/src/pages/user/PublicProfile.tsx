import { IoSettingsOutline } from "react-icons/io5";
import { useStore } from "../../utils/store/globalStore";
import { Link } from "react-router-dom";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { UserProfile } from "../../types/Profile";
import { useState, useEffect, useReducer } from "react";
import baseAPI from "../../utils/api/api";
import Articles from "../../components/articles/Articles";
import ArticlePreview from "../../components/articles/ArticlePreview";
import FollowUserButton from "../../components/follows/FollowUserButton";
import articleReducer, { Filters } from "../../utils/context/articleReducer";
function Profile() {
  const { username } = useParams<string>();
  const storedUser = useStore((state) => state.currentUser);
  const initialFilters: Filters = {
    feed: false,
    author: username,
    favourited: false,
    limit: 3,
    page: 1,
  };

  const [state, dispatch] = useReducer(articleReducer, initialFilters);
  const [IsLoading, setIsLoading] = useState(false);
  const { data: profile, isLoading } = useQuery<UserProfile, AxiosError>(
    ["profile"],
    () => baseAPI.getProfile(username),
    {
      onSuccess: (data) => {
        setIsLoading(true);
        dispatch({ type: "AUTHOR", author: username });
      },
    }
  );

  const handleAuthorClick = () => {
    dispatch({ type: "AUTHOR", author: username });
  };

  const handleFavouritedClick = () => {
    dispatch({ type: "FAVOURITED" });
  };

  return (
    <>
      {IsLoading && (
        <>
          <div className="bg-[#f7f6f6] xl:h-[300px] md:h-[290px] h-[290px]">
            <div className="max-w-3xl mx-auto xl:pt-10 md:pt-5 pt-4">
              <>
                <div className="flex flex-col">
                  <div className="mx-auto">
                    <img
                      src={
                        profile.image
                          ? profile.image
                          : "https://api.realworld.io/images/demo-avatar.png"
                      }
                      alt={profile.username}
                      className="w-[125px] object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-center mt-2 text-lg">
                      @{profile.username}
                    </h5>
                    <p className="text-center italic">
                      {profile.bio ? profile.bio : "No bio yet"}
                    </p>
                  </div>
                </div>
                <div className="flex xl:justify-end md:justify-end justify-center mt-2">
                  {storedUser?.user?.username !== profile.username && (
                    <div>
                      <FollowUserButton profile={profile} />
                    </div>
                  )}
                  {storedUser?.user?.username === profile.username && (
                    <>
                      <Link to={`/profile/${profile.username}/settings`}>
                        <div className="flex flex-row text-gray-400 cursor-pointer p-2 text-sm border-[1px] border-gray-400 rounded hover:bg-gray-300 hover:text-white">
                          <p className="mt-1 mr-1">
                            <IoSettingsOutline />
                          </p>
                          <p>Edit Profile Settings</p>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </>
            </div>
          </div>
          <div className="xl:max-w-5xl md:max-w-4xl w-full mx-auto pt-1 ">
            <div className="xl:mt-12 md:mt-10 border-b-[1px] xl:w-[70%] md:w-[70%] w-full">
              <div className="flex flex-row">
                <button
                  className="p-2 hover:text-gray-500 text-[#aaa]"
                  onClick={handleAuthorClick}
                  style={{
                    borderBottom: "1px solid green",
                    color: "green",
                  }}
                >
                  Your Articles
                </button>
                {storedUser?.user?.username === profile.username ? (
                  <button
                    className="p-2 text-[#aaa] hover:text-gray-500"
                    onClick={handleFavouritedClick}
                    style={{
                      borderBottom: state.favourited
                        ? "1px solid green"
                        : "white",
                      color: state.favourited ? "green" : "black",
                    }}
                  >
                    Your Favourited Articles
                  </button>
                ) : null}
              </div>
            </div>
            <div className="mx-auto mt-0 p-2">
              <Articles filters={state} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default Profile;
