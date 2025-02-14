import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";

import { restoreUser } from "../store/session";

import WelcomePage from "./components/Welcome/WelcomePage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import Navigation from "./components/Navigation/NavigationBar";
import HomePage from "./components/Home/HomePage";
import Stocks from "./components/Stocks";
import Stock from "./components/Stock/StockPage/StockPage";
import ProfilePage from "./components/Profile";
import Account from "./components/Account/AccountLayout";
import InvestingPage from "./components/Account/InvestingPage/InvestingPage";
import TransfersPage from "./components/Account/TransfersPage/TransfersPage";
import HistoryPage from "./components/Account/HistoryPage/HistoryPage";
import HelpPage from "./components/Account/HelpPage";
import SettingsPage from "./components/Account/Settings/SettingsLayout/SettingsLayout";
import SecurityPage from "./components/Account/Settings/SecurityPage";
import AppearancePage from "./components/Account/Settings/AppearancePage";
import ListPage from "./components/ListPage/ListPage";

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
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
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
            path: "lists/:listId",
            element: <ListPage />,
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
                path: "investing",
                element: <InvestingPage />,
              },
              {
                path: "transfers",
                element: <TransfersPage />,
              },
              {
                path: "history",
                element: <HistoryPage />,
              },
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
