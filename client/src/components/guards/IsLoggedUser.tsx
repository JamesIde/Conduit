import { useParams } from "react-router-dom";
import { useStore } from "../../utils/store/globalStore";
import { Navigate, Outlet } from "react-router-dom";
function IsLoggedUser() {
  const { username } = useParams();
  const currentUser = useStore((state) => state.currentUser);
  return username !== currentUser?.data?.username ? (
    <Outlet />
  ) : (
    <Navigate to={`/profile/user/${username}`} />
  );
}
export default IsLoggedUser;
