import "./MobileListSideBar.css";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import PortfolioStocks from "../../ListSideBar/PortfolioStocks/PortfolioStocks";
import Lists from "../../ListSideBar/Lists/Lists";

import Skeleton from "../../Skeleton";

import { fetchLists, selectListsArray } from "../../../../store/lists";
import { fetchAllStocks, selectStocksObject } from "../../../../store/stocks";
import { selectUser } from "../../../../store/session";

function MobileListSideBar({
  showDropdown = true,
  setShowListSideBar,
  showListSideBar,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const lists = useSelector(selectListsArray);
  const stocks = useSelector(selectStocksObject);
  const sessionUser = useSelector(selectUser);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchInfo() {
      try {
        await dispatch(fetchLists());
        await dispatch(fetchAllStocks());

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        if (!isMounted) {
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
        <div className="ListSideBar__error-container">
          <div className="ListSideBar__error">
            Error loading data. Please try again later.
          </div>
          <div className="ListSideBar__error-image" />
        </div>
      </aside>
    );
  }

  if (isLoading)
    return (
      <div className="MobileListSideBar">
        <div className="MobileListSideBar__skeleton-stocks-header">
          <Skeleton height="80px" />
        </div>
        <div className="MobileListSideBar__skeleton-stocks">
          <Skeleton height="300px" />
        </div>
        <div className="MobileListSideBar__skeleton-lists-header">
          <Skeleton height="80px" />
        </div>
        <div className="MobileListSideBar__skeleton-lists">
          <Skeleton height="300px" />
        </div>
      </div>
    );

  return (
    <div className="MobileListSideBar">
      <PortfolioStocks
        stocks={stocks}
        sessionUser={sessionUser}
        setShowListSideBar={setShowListSideBar}
        showListSideBar={showListSideBar}
      />

      <Lists
        lists={lists}
        stocks={stocks}
        navigate={navigate}
        sessionUser={sessionUser}
        showDropdown={showDropdown}
        setShowListSideBar={setShowListSideBar}
        showListSideBar={showListSideBar}
      />
    </div>
  );
}

export default MobileListSideBar;
