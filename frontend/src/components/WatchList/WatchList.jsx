import "./WatchList.css";
import { FaPlus } from "react-icons/fa6";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchUsersLists } from "../../../store/lists";

import OpenModalButton from "../OpenModalButton";
import WatchListModal from "./WatchListModal";
import ListItem from "./ListItem";

function WatchList() {
  const dispatch = useDispatch();
  const lists = useSelector((state) => state.lists.allLists);

  useEffect(() => {
     dispatch(fetchUsersLists());
  }, [dispatch]);

  return (
    <div className="WatchList">

      <div className="WatchList__container">

        <div className="WatchList__header">
          <span className="WatchList__title">Lists</span>
          <span className="WatchList__create-list-span">
            <OpenModalButton
              modalComponent={<WatchListModal />}
              className="WatchList__create-list-icon"
              Element={FaPlus}
              modalClass={{
                modal: "WatchList__modal",
                modalBackground: "WatchList__modal__background",
                modalContainer: "WatchList__modal__container",
              }}
            />
          </span>
        </div>

        <div className="WatchList__lists">
          {lists &&
            lists.slice(0, 10).map((list) => {
              return <ListItem list={list} key={list.id} />;
            })}
        </div>
      </div>

    </div>
  );
}

export default WatchList;
