import "./WatchList.css";
import { FaPlus } from "react-icons/fa6";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchUsersLists, selectListsArray } from "../../../store/lists";

import OpenModalButton from "../OpenModalButton";
import WatchListModal from "./CreateListModal";
import ListItem from "./ListItem";

import WatchListStocks from "./WatchListStocks/WatchListStocks";

function WatchList({ className }) {
  const dispatch = useDispatch();

  const lists = useSelector(selectListsArray);
  console.log("lists:", lists);

  const [selectedPopoverId, setSelectedPopoverId] = useState(null);
  const [toggleListIds, setToggleListIds] = useState([]);

  useEffect(() => {
    dispatch(fetchUsersLists());
  }, [dispatch]);

  return (
    <div className="WatchList">
      <div className={className}>
        <div className="WatchList__header">
          <span className="WatchList__title">Lists</span>
          <span className="WatchList__create-list-span">
            <OpenModalButton
              modalComponent={<WatchListModal />}
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
                  <WatchListStocks
                    toggleListIds={toggleListIds}
                    setToggleListIds={setToggleListIds}
                    list={list}
                  />
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default WatchList;
