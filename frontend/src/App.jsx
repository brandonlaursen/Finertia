import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// components
import WelcomePage from "./components/WelcomePage";
import LoginFormPage from "./components/LoginFormPage";
import SignUpPage from "./components/SignUpPage";
// import HomePage from "./components/WelcomePage/WelcomePage";
// import LoadingSpinner from "./components/LoadingSpinner";

// store
// import { restoreUser } from "../store/session";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      // dispatch(restoreUser());
      setIsLoaded(true);
    };

    loadUser();
  }, [dispatch]);

  return <>{isLoaded && <WelcomePage isLoaded={isLoaded} />}</>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
