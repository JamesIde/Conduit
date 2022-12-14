import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlinePlusSm } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import baseAPI from "../../utils/api/api";
import { APIError } from "../../types/Error";
import { UserProfile } from "../../types/Profile";
import { FollowMetadata } from "../../types/User";
import { useStore } from "../../utils/store/globalStore";

function FollowUserButton({ profile }: { profile: UserProfile }) {
  const currentUser = useStore((state) => state.currentUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [IsProcessing, setIsProcessing] = useState(false);

  const notify = (text: string) => toast.error(`${text}`);

  const { mutate, error = {} as AxiosError<APIError> } = useMutation(
    ["followUser"],
    baseAPI.handleFollowUser,
    {
      onSuccess: (data) => {
        setIsProcessing(false);
        queryClient.refetchQueries(["profile"]);
      },
      onError: (err: AxiosError<APIError>) => {
        setIsProcessing(false);
        notify(err.response.data?.message);
      },
    }
  );

  const handleFollow = (username: string, isFollowedByLoggedUser: boolean) => {
    if (!currentUser) {
      navigate("/login");
    } else {
      setIsProcessing((prevState) => !prevState);
      const metadata: FollowMetadata = {
        username: username,
        isFollowed: isFollowedByLoggedUser,
      };
      mutate(metadata);
    }
  };
  return (
    <div className="pr-2 mx-auto pb-5 w-full">
      <button
        className="flex flex-row p-1 rounded pr-4 border-[1px] border-gray-400 hover:cursor-pointer hover:border-gray-900 hover:bg-gray-400 hover:duration-500"
        style={{
          color: profile.isFollowed ? "rgb(156 163 175)" : "rgb(156 163 175)",
          backgroundColor: profile.isFollowed ? "transparent" : "transparent",
          cursor: "pointer",
        }}
        onClick={() => handleFollow(profile.username, profile.isFollowed)}
      >
        <p className="mr-1 pt-[1px]">
          <HiOutlinePlusSm size={22} />
        </p>
        <p>
          {profile.isFollowed
            ? `Unfollow ${profile.username}`
            : `Follow ${profile.username}`}
        </p>
      </button>
    </div>
  );
}
export default FollowUserButton;
