import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { useDispatch } from "react-redux";

// components
import WelcomePage from "./components/WelcomePage";
import HomePage from "./components/HomePage";
import LoginFormPage from "./components/LoginFormPage";
import SignUpPage from "./components/SignUpPage";
import Stock from "./components/Stock/Stock";
import NavBar from "./components/HomePage/HomePageNavBar";
import Stocks from "./components/Stocks";

// store
import { restoreUser } from "../store/session";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(restoreUser());
      setIsLoaded(true);
    };

    loadUser();
  }, [dispatch]);

  return <>{isLoaded && <Outlet />}</>;
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/welcome",
        element: <WelcomePage />,
      },
      {
        path: "/",
        element: <NavBar />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            index: true,
            path: "stocks",
            element: <Stocks />,
          },
          {
            path: "stocks/:stockSymbol",
            element: <Stock />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginFormPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
