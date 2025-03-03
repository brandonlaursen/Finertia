import "./ListSideBar.css";
import { FaPlus } from "react-icons/fa6";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import ListItem from "./ListItem";
import ListStocks from "./ListStocks/ListStocks";
import StocksOwned from "./StocksOwned/StocksOwned";
import OpenModalButton from "../OpenModalButton";
import LoadingSpinner from "../LoadingSpinner";
import CreateListModal from "../../modals/CreateListModal";

import { fetchLists, selectListsArray } from "../../../store/lists";
import { fetchAllStocks, selectStocksObject } from "../../../store/stocks";
import { selectUser } from "../../../store/session";

function ListSideBar({ className, navigate }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const lists = useSelector(selectListsArray);
  const stocks = useSelector(selectStocksObject);
  const sessionUser = useSelector(selectUser);

  const [activeListId, setActiveListId] = useState(null);
  const [expandedListIds, setExpandedListIds] = useState([]);
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

  if (!isLoaded) {
    return (
      <div className="ListSideBar__loading-spinner">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <aside className="ListSideBar">
      <main className={className}>
        {location.pathname === "/" && (
          <>
            <section className="ListSideBar__header">
              <header>Stocks</header>
            </section>

            <StocksOwned stocks={stocks} sessionUser={sessionUser} />
          </>
        )}

        <section className="ListSideBar__header">
          <header>Lists</header>
          <button className="ListSideBar__create-button">
            <OpenModalButton
              modalComponent={<CreateListModal />}
              className="ListSideBar__create-button-icon"
              Element={FaPlus}
              modalClass={{
                modal: "CreateListModal__step-one",
                modalBackground: "CreateListModal__step-one__overlay",
                modalContainer: "CreateListModal__one__container",
              }}
            />
          </button>
        </section>

        <section className="ListSideBar__container">
          {lists &&
            lists.slice(0, 10).map((list) => (
              <div key={list.id}>
                <ListItem
                  list={list}
                  className="WatchList__ListItem"
                  container="ListItem__container"
                  emoji="ListItem__emoji"
                  name="ListItem__name"
                  showActions={true}
                  showHover={true}
                  navigate={navigate}
                  expandedListIds={expandedListIds}
                  setExpandedListIds={setExpandedListIds}
                  activeListId={activeListId}
                  setActiveListId={setActiveListId}
                />
                <ListStocks
                  expandedListIds={expandedListIds}
                  setExpandedListIds={setExpandedListIds}
                  list={list}
                  stocks={stocks}
                  sessionUser={sessionUser}
                />
              </div>
            ))}
        </section>
      </main>
    </aside>
  );
}

export default ListSideBar;
