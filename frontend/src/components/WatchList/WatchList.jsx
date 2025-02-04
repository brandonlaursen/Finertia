import "./WatchList.css";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";

import OpenModalButton from "../OpenModalButton";

import WatchListModal from "./WatchListModal";

function WatchList() {


  const WatchListModelStyles = {
    modal: 'WatchList__modal',
    modalBackground: 'WatchList__modal__background',
    modalContainer: 'WatchList__modal__container'
  }
  return (
    <div className="WatchList">
      <div className="WatchList__container">
        <div className="WatchList__header">
          <span className="WatchList__title">Lists</span>

          <OpenModalButton
            modalComponent={<WatchListModal />}
            className="WatchList__create-list-icon"
            Element={FaPlus}
            modalClass={WatchListModelStyles}
          />
        </div>

        <div className="WatchList__lists">
          <Link to="/list1" className="WatchList__list">
            <div className="WatchList__stock-container">
              <span className="WatchList__stock-icon">💡</span>
              <span className="WatchList__stock-title">My First List</span>
            </div>
          </Link>

          <Link to="/list1" className="WatchList__list">
            <div className="WatchList__stock-container">
              <span className="WatchList__stock-icon">⚡</span>
              <span className="WatchList__stock-title">
                Stocks to Watch list
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WatchList;
