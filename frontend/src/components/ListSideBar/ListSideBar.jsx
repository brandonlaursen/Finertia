import "./ListSideBar.css";
import { FaPlus } from "react-icons/fa6";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { fetchLists, selectListsArray } from "../../../store/lists";
import { fetchAllStocks } from "../../../store/stocks";
import { selectUser } from "../../../store/session";

import ListItem from "./ListItem";
import ListStocks from "./ListStocks/ListStocks";
import StocksOwned from "./StocksOwned/StocksOwned";
import OpenModalButton from "../OpenModalButton";

import CreateListModal from "../../modals/CreateListModal";

import { selectStocksObject } from "../../../store/stocks";

function ListSideBar({ className, navigate }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const lists = useSelector(selectListsArray);
  const stocks = useSelector(selectStocksObject);
  const sessionUser = useSelector(selectUser);

  const [selectedPopoverId, setSelectedPopoverId] = useState(null);
  const [toggleListIds, setToggleListIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchInfo() {
      await dispatch(fetchLists());
      await dispatch(fetchAllStocks());
      setIsLoaded(true);
    }
    fetchInfo();
  }, [dispatch]);

  return (
    <aside className="ListSideBar">
      <main className={className}>
        {location.pathname === "/" && (
          <>
            <section className="ListSideBar__header">
              <header>Stocks</header>
            </section>

            {isLoaded && (
              <StocksOwned stocks={stocks} sessionUser={sessionUser} />
            )}
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
            lists.slice(0, 10).map((list) => {
              return (
                <>
                  <ListItem
                    className="WatchList__ListItem"
                    container="ListItem__container"
                    emoji="ListItem__emoji"
                    name="ListItem__name"
                    showActions={true}
                    showHover={true}
                    navigate={navigate}
                    list={list}
                    toggleListIds={toggleListIds}
                    setToggleListIds={setToggleListIds}
                    selectedPopoverId={selectedPopoverId}
                    setSelectedPopoverId={setSelectedPopoverId}
                  />
                  <ListStocks
                    toggleListIds={toggleListIds}
                    setToggleListIds={setToggleListIds}
                    list={list}
                    stocks={stocks}
                    sessionUser={sessionUser}
                  />
                </>
              );
            })}
        </section>
      </main>
    </aside>
  );
}

export default ListSideBar;
