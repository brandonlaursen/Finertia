import "./WatchList.css";

import { FaPlus } from "react-icons/fa6";

import OpenModalButton from "../OpenModalButton";
import WatchListModal from "./WatchListModal";
import ListItem from "./ListItem";

function WatchList() {


  const WatchListModelStyles = {
    modal: "WatchList__modal",
    modalBackground: "WatchList__modal__background",
    modalContainer: "WatchList__modal__container",
  };
  
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
              modalClass={WatchListModelStyles}
            />
          </span>
        </div>

        <div className="WatchList__lists">

        <ListItem />
        <ListItem />
        </div>
      </div>
    </div>
  );
}

export default WatchList;
