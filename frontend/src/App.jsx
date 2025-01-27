import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../store/session";

// components
import WelcomePage from "./components/WelcomePage";
import HomePage from "./components/HomePage";
import LoginFormPage from "./components/LoginFormPage";
import SignUpPage from "./components/SignUpPage";

// store
import { restoreUser } from "../store/session";

function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector(selectUser);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(restoreUser());
      setIsLoaded(true);
    };

    loadUser();
  }, [dispatch]);

  useEffect(() => {
    if (isLoaded && sessionUser) {
      navigate("/home", { replace: true });
    }
  }, [isLoaded, sessionUser, navigate]);

  return <>{isLoaded && !sessionUser && <WelcomePage isLoaded={isLoaded} />}</>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
  },
  {
    path:'/home',
    element: <HomePage />
  },
  {
    path: "/login",
    element: <LoginFormPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
