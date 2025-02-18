import "./ListContainer.css";
import { FaPlus } from "react-icons/fa6";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import { fetchLists, selectListsArray } from "../../../../store/lists";
import { fetchAllStocks } from "../../../../store/stocks";
import { selectUser } from "../../../../store/session";

import OpenModalButton from "../../OpenModalButton";
import CreateListModal from "../../Modals/CreateListModal";

import ListItem from "../ListItem";
import ListStocks from "../ListStocks/ListStocks";
import StocksOwned from "../StocksOwned/StocksOwned";

import { selectStocksObject } from "../../../../store/stocks";

function ListContainer({ className, navigate }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const lists = useSelector(selectListsArray);
  const stocks = useSelector(selectStocksObject);
  const sessionUser = useSelector(selectUser);

  const [selectedPopoverId, setSelectedPopoverId] = useState(null);
  const [toggleListIds, setToggleListIds] = useState([]);

  useEffect(() => {
    dispatch(fetchLists());
    dispatch(fetchAllStocks());
  }, [dispatch]);



  return (
    <div className="WatchList">
      <div className={className}>
        {location.pathname === "/" && (
          <>
            <div className="WatchList__header">
              <span className="WatchList__title">Stocks</span>
            </div>

            {sessionUser && <StocksOwned stocks={stocks} sessionUser={sessionUser}/>}
          </>
        )}

        <div className="WatchList__header WatchList__header-lists">
          <span className="WatchList__title">Lists</span>
          <span className="WatchList__create-list-span">
            <OpenModalButton
              modalComponent={<CreateListModal />}
              className="WatchList__create-list-icon"
              Element={FaPlus}
              modalClass={{
                modal: "CreateListModal__one",
                modalBackground: "CreateListModal__one__background",
                modalContainer: "CreateListModal__one__container",
              }}
            />
          </span>
        </div>

        <div className="WatchList__lists">
          {lists &&
            lists.slice(0, 10).map((list) => {
              return (
                <>
                  <ListItem
                    list={list}
                    selectedPopoverId={selectedPopoverId}
                    setSelectedPopoverId={setSelectedPopoverId}
                    className="WatchList__lists__ListItem"
                    container="ListItem__container"
                    icon="ListItem__icon"
                    title="ListItem__title"
                    popover={true}
                    toggleListIds={toggleListIds}
                    setToggleListIds={setToggleListIds}
                    navigate={navigate}
                    hover={true}

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
        </div>
      </div>
    </div>
  );
}

export default ListContainer;
