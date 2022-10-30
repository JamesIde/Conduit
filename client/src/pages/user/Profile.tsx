import { IoSettingsOutline } from "react-icons/io5";
import { useStore } from "../../components/store/userStore";
import { Link } from "react-router-dom";
function Profile() {
  const currentUser = useStore((state) => state.currentUser);
  return (
    <>
      <div className="bg-[#f3f3f3] xl:h-[300px] md:h-[290px] h-[250px]">
        <div className="max-w-3xl mx-auto xl:pt-10 md:pt-5">
          <div className="flex flex-col">
            <div className="mx-auto">
              <img
                src={currentUser.user.image}
                alt=""
                className="w-[150px] object-cover rounded-xl"
              />
            </div>
            <div>
              <h5 className="font-bold text-center mt-2 text-lg">
                @{currentUser.user.username}
              </h5>
              <p className="text-center italic">
                {currentUser.user.bio ? currentUser.user.bio : "No bio yet"}
              </p>
            </div>
          </div>
          <div className="flex xl:justify-end md:justify-end justify-center border-2">
            <Link to={`/profile/${currentUser.user.username}/settings`}>
              <div className="flex flex-row text-gray-400 cursor-pointer p-2 text-sm border-[1px] border-gray-400 rounded hover:bg-gray-300 hover:text-white">
                <p className="mt-1 mr-1">
                  <IoSettingsOutline />
                </p>
                <p>Edit Profile Settings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default Profile;
