import Layout from "./components/navigation/Layout";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/user/Login";
import Settings from "./pages/user/Settings";
import PublicProfile from "./pages/user/PublicProfile";
import PrivateProfile from "./pages/user/PrivateProfile";
import CreateArticle from "./pages/articles/CreateArticle";
import PrivateRoute from "./components/guards/PrivateRoute";
import ViewArticle from "./pages/articles/ViewArticle";
import Register from "./pages/user/Register";
import ScrollToTop from "./components/helper/ScrollToTop";
import IsLoggedUser from "./components/guards/IsLoggedUser";
function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/article/:slug" element={<ViewArticle />} />
        {/* Private */}
        <Route path="/profile/:username/settings" element={<PrivateRoute />}>
          <Route path="/profile/:username/settings" element={<Settings />} />
        </Route>
        <Route path="/article/new" element={<CreateArticle />} />
        <Route path="/profile/:username" element={<IsLoggedUser />}>
          <Route path="/profile/:username" element={<PublicProfile />} />
        </Route>
        <Route path="/profile/user/:username" element={<PrivateProfile />} />
        {/* /profile/user/:username, then query for user based on username param */}
      </Routes>
    </Layout>
  );
}

export default App;
