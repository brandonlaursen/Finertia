import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";

import { restoreUser } from "../store/session";

import HomeLayout from "./layouts/HomeLayout";
import AccountLayout from "./layouts/AccountLayout";
import SettingsLayout from "./layouts/SettingsLayout";

import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import StocksPage from "./pages/StocksPage";
import StockPage from "./pages/StockPage";
import ListPage from "./pages/ListPage";
import ProfilePage from "./pages/ProfilePage";
import InvestingPage from "./pages/InvestingPage";
import TransfersPage from "./pages/TransfersPage";
import HistoryPage from "./pages/HistoryPage";
import HelpPage from "./pages/HelpPage";
import SecurityPage from "./pages/SecurityPage";
import AppearancePage from "./pages/AppearancePage";

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
        element: <HomeLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            index: true,
            path: "stocks",
            element: <StocksPage />,
          },
          {
            path: "stocks/:stockSymbol",
            element: <StockPage />,
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
            element: <AccountLayout />,
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
                element: <SettingsLayout />,
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
