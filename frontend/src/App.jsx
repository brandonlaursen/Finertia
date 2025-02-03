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
import Settings from "./components/Settings";
import SettingsPage from "./components/Settings/SettingsPage/SettingsPage";
import SecurityPage from "./components/Settings/Security";
import HelpPage from "./components/Settings/Help";
import AppearancePage from "./components/Settings/Appearance";

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
            path: "settings",
            element: <Settings />,
            children: [
              {
                path: "",
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
              {
                path: "help",
                element: <HelpPage />,
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
