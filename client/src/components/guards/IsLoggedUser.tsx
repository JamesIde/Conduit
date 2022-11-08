import { useParams } from "react-router-dom";
import { useStore } from "../store/userStore";
import { Navigate, Outlet } from "react-router-dom";
function IsLoggedUser() {
  const { username } = useParams();
  const currentUser = useStore((state) => state.currentUser);
  return username !== currentUser?.user?.username ? (
    <Outlet />
  ) : (
    <Navigate to={`/profile/user/${username}`} />
  );
}
export default IsLoggedUser;
