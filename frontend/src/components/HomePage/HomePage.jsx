import "./HomePage.css";

import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { selectUser, restoreUser } from "../../../store/session";

import HomePageBody from "./HomePageBody/HomePageBody";
import NavBar from "./HomePageNavBar";

function HomePage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(selectUser);

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(restoreUser());
    };

    loadUser();
  }, [dispatch]);

  if (!sessionUser) return <Navigate to="/" replace />;

  return (
    <div className="home-page-container">
      <NavBar sessionUser={sessionUser} />
      <HomePageBody />
    </div>
  );
}

export default HomePage;
