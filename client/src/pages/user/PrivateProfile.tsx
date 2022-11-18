import { IoSettingsOutline } from "react-icons/io5";
import { useStore } from "../../components/store/globalStore";
import { Link } from "react-router-dom";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { UserProfile } from "../../types/Profile";
import { useState, useEffect } from "react";
import baseAPI from "../../config/api";
import Articles from "../../components/articles/Articles";
import ArticlePreview from "../../components/articles/ArticlePreview";
import FollowUserButton from "../../components/follows/FollowUserButton";
function Profile() {
  const { username } = useParams<string>();
  const queryClient = new QueryClient();
  const initialFilters = {
    feed: false,
    author: null,
    favourited: false,
    limit: 3,
    page: 1,
    isProfile: true,
  };
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [filters, setFilters] = useState({
    ...initialFilters,
  });

  // TODO Re do page logic. Remove blend between logged in user and user from params. Too complicated. Make them seperated.
  const storedUser = useStore((state) => state.currentUser);
  const {
    data: profile,
    isLoading,
    isError,
    isSuccess,
    error = {} as AxiosError,
  } = useQuery<UserProfile, AxiosError>(
    ["profile"],
    () => baseAPI.getProfile(username),
    {
      onSuccess: (data) => {
        setIsAuthor(true);
        setFilters({
          ...initialFilters,
          author: username,
        });
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const handleAuthorClick = () => {
    setIsAuthor(true);
    setIsFavourited(false);
    setFilters({ ...initialFilters, author: username, favourited: false });
  };

  const handleFavouritedClick = () => {
    setIsAuthor(false);
    setIsFavourited(true);
    setFilters({
      ...initialFilters,
      favourited: true,
    });
  };

  return (
    <>
      <div className="bg-[#f7f6f6] xl:h-[300px] md:h-[290px] h-[290px]">
        <div className="max-w-3xl mx-auto xl:pt-10 md:pt-5 pt-4">
          {profile && (
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
                  <p className="text-center italic p-[4px]">
                    {profile.bio ? profile.bio : "No bio yet"}
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-1">
                {storedUser?.user?.username !== profile.username && (
                  <div>
                    <FollowUserButton profile={profile} />
                  </div>
                )}
                <>
                  <Link to={`/profile/${profile.username}/settings`}>
                    <div className="flex flex-row text-gray-400 cursor-pointer p-2 text-sm border-[1px] border-gray-400 rounded hover:border-gray-900 hover:duration-500">
                      <p className="mt-1 mr-1">
                        <IoSettingsOutline />
                      </p>
                      <p>Edit Profile Settings</p>
                    </div>
                  </Link>
                </>
              </div>
            </>
          )}
        </div>
      </div>
      <section id="profile-articles">
        <div className="xl:max-w-5xl md:max-w-4xl w-full mx-auto pt-1 ">
          <div className="xl:mt-12 md:mt-10 border-b-[1px] xl:w-[70%] md:w-[70%] w-full">
            <div className="flex flex-row">
              <button
                className="p-2 hover:text-gray-500 text-[#aaa]"
                onClick={handleAuthorClick}
                style={{
                  borderBottom: isAuthor ? "1px solid green" : "white",
                  color: isAuthor ? "green" : "black",
                }}
              >
                Your Articles
              </button>
              <button
                className="p-2 text-[#aaa] hover:text-gray-500"
                onClick={handleFavouritedClick}
                style={{
                  borderBottom: isFavourited ? "1px solid green" : "white",
                  color: isFavourited ? "green" : "black",
                }}
              >
                Your Favourited Articles
              </button>
            </div>
          </div>
          <div className="mx-auto mt-0 p-2">
            <Articles filters={filters} />
          </div>
        </div>
      </section>
    </>
  );
}
export default Profile;
