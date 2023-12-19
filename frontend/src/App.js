import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPage from "./components/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { helperFunctions } from "./helpers/functions";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const incrementPageViews = async () => {
    const data = {
      path: window.location.pathname,
      userAgent: window.navigator.userAgent,
    };
    await helperFunctions.pageViews(data);
  };

  const login = (user) => {
    setLoggedInUser(user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await helperFunctions.logout();

    setIsAuthenticated(false);
    setLoggedInUser(null);
  };

  return (
    <Router>
      <Header user={loggedInUser} logout={logout} />
      <Routes>
        <Route
          exact
          path="/"
          element={<MainPage incrementPageViews={incrementPageViews} />}
        />
        <Route
          exact
          path="/login"
          element={
            <Login login={login} incrementPageViews={incrementPageViews} />
          }
        />
        <Route
          exact
          path="/register"
          element={<Register incrementPageViews={incrementPageViews} />}
        />
        <Route element={<ProtectedRoute isAuth={isAuthenticated} />}>
          <Route
            exact
            path="/admin"
            element={
              <AdminPage
                incrementPageViews={incrementPageViews}
                logout={logout}
              />
            }
          />
        </Route>
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
