import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";

import { restoreUser } from "../store/session";

import WelcomePage from "./components/WelcomePage";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import Stocks from "./components/Stocks";
import Stock from "./components/Stock/Stock";
import ProfilePage from "./components/Profile";
import Account from "./components/Account";
import SettingsPage from "./components/Account/Settings/SettingsPage";
import SecurityPage from "./components/Account/Settings/SecurityPage";
import HelpPage from "./components/Account/HelpPage";
import AppearancePage from "./components/Account/Settings/AppearancePage";

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
        element: <Navigation />,
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
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "account",
            element: <Account />,
            children: [
              {
                path: "help",
                element: <HelpPage />,
              },
              {
                path: "settings",
                element: <SettingsPage />,
                children: [
                  {
                    path: "security",
                    element: <SecurityPage />,
                  },
                  {
                    path: "appearance",
                    element: <AppearancePage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
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
