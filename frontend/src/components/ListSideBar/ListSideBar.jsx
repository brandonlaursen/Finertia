import "./ListSideBar.css";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import PortfolioStocks from "./PortfolioStocks/PortfolioStocks";
import Lists from "./Lists/Lists";

import { fetchLists, selectListsArray } from "../../../store/lists";
import { fetchAllStocks, selectStocksObject } from "../../../store/stocks";
import { selectUser } from "../../../store/session";

function ListSideBar({ navigate, setNotifications, setNotificationMessage }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const lists = useSelector(selectListsArray);
  const stocks = useSelector(selectStocksObject);
  const sessionUser = useSelector(selectUser);

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchInfo() {
      try {
        await dispatch(fetchLists());
        await dispatch(fetchAllStocks());

        if (isMounted) {
          setIsLoaded(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error("Error fetching data:", err);
        }
      }
    }

    fetchInfo();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (error) {
    return (
      <aside className="ListSideBar">
        <div className="ListSideBar__error">
          Error loading data. Please try again later.
        </div>
      </aside>
    );
  }

  if (!isLoaded) return <div className="ListSideBar__loading" />;

  return (
    <aside className="ListSideBar">
      {location.pathname === "/" && (
        <PortfolioStocks stocks={stocks} sessionUser={sessionUser} />
      )}

      <Lists
        lists={lists}
        stocks={stocks}
        navigate={navigate}
        sessionUser={sessionUser}
        setNotifications={setNotifications}
        setNotificationMessage={setNotificationMessage}
      />
    </aside>
  );
}

export default ListSideBar;
