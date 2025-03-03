import "./HomeLayout.css";

import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import NavigationBar from "../../components/NavigationBar/NavigationBar";

function HomeLayout() {
  const routeClass =
    location.pathname === "/stocks" ? "stocks-nav" : "Navigation";

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".StocksPage__banner");
      if (header) {
        const offset = header.getBoundingClientRect().top;
        setScrolled(offset <= 74);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [routeClass]);

  return (
    <>
      <NavigationBar scrolled={scrolled} routeClass={routeClass} />
      <Outlet context={{ scrolled }} />
    </>
  );
}

export default HomeLayout;
