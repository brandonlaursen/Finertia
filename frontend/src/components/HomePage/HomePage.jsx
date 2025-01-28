import "./HomePage.css";
import { useSelector } from "react-redux";

import { selectUser } from "../../../store/session";

import HomePageBody from "./HomePageBody/HomePageBody";
import NavBar from "./HomePageNavBar";

function HomePage() {

  const sessionUser = useSelector(selectUser);

  return (
    <div className="home-page-container">
      <NavBar sessionUser={sessionUser} />
      <HomePageBody />
    </div>
  );
}

export default HomePage;
