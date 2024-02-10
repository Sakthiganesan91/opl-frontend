import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import AuthScreen from "./Pages/Authentication/AuthScreen";
import ForgotPassword from "./Pages/Authentication/ForgotPassword";
import ChangePassword from "./Pages/Authentication/ChangePassword";
import { useContext } from "react";
import { authContext } from "./hooks/authContext";
import MainHome from "./Pages/Home/MainHome";
import Query from "./Pages/Home/Query";
import ProfilePage from "./Pages/Profile/ProfilePage";
import SavedPostPage from "./Pages/SavedPosts/SavedPostPage";
import RoomSelectionPage from "./Pages/Authentication/RoomSelectionPage";
import Navbar from "./Components/Navbar";
function App() {
  const { user } = useContext(authContext);
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/auth"
            element={!user ? <AuthScreen /> : <Navigate to="/" />}
          />

          <Route
            path="/room-select"
            element={!user ? <RoomSelectionPage /> : <Navigate to="/" />}
          />

          <Route
            path="/forgot-password"
            element={!user ? <ForgotPassword /> : <Navigate to="/" />}
          />
          <Route
            path="/change-password"
            element={!user ? <ChangePassword /> : <Navigate to="/" />}
          />

          <Route
            path="/"
            element={user ? <MainHome /> : <Navigate to="/auth" />}
          />
          <Route path="/profile" element={user && <ProfilePage />} />
          <Route path="/saved-post" element={user && <SavedPostPage />} />

          <Route
            path="/query/:room/:queryId"
            element={user ? <Query /> : <Navigate to="/auth" />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
