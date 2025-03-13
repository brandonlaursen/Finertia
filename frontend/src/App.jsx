import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { restoreUser } from "../store/session";
import { selectUser } from "../store/session";

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
import NotFoundPage from "./pages/NotFoundPage";

function ProtectedRoute({ children }) {
  const sessionUser = useSelector(selectUser);
 
  if (!sessionUser) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    const loadUser = async () => {
      if (!sessionUser) {
        await dispatch(restoreUser());
      }
      setIsLoaded(true);
    };

    loadUser();
  }, [dispatch, sessionUser]);

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
        element: (
          <ProtectedRoute>
            <HomeLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
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
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
