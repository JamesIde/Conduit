import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? <Outlet /> : <Navigate to="/" />;
}
export default PrivateRoute;
