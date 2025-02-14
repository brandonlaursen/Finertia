import "./ListContainer.css";
import { FaPlus } from "react-icons/fa6";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchLists, selectListsArray } from "../../../../store/lists";
import { fetchAllStocks } from "../../../../store/stocks";
import { selectUser } from "../../../../store/session";

import OpenModalButton from "../../OpenModalButton";
import CreateListModal from "../../Modals/CreateListModal";

import ListItem from "../ListItem";
import ListStocks from "../ListStocks/ListStocks";
import StocksOwned from "../../Home/StocksOwned/StocksOwned";

function ListContainer({ className }) {
  const dispatch = useDispatch();

  const lists = useSelector(selectListsArray);
  const stocks = useSelector((state) => state.stocks.allStocks);
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
        <div className="WatchList__header">
          <span className="WatchList__title">Stocks</span>
        </div>

        <StocksOwned allStocks={stocks} />

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
