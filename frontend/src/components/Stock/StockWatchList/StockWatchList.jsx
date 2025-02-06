import "./StockWatchList.css";

import { IoIosCheckmark } from "react-icons/io";

import AddToListModal from "./AddToListModal/AddToListModal";

import { useModal } from "../../../context/Modal";

function StockWatchList({ stock }) {

  const { setModalContent, setModalClass } = useModal();

  return (
    <div className="StockWatchList">
      <div className="StockWatchList__container">
        <div className="StockWatchList__body">
          <div className="StockWatchList__title">Buy AAPL</div>
          <div className="StockWatchList__text">
            You can start investing once your application is approved.
          </div>
        </div>

        <button
          className="StockWatchList__button"
          onClick={(e) => {
            e.stopPropagation();
            setModalContent(<AddToListModal stock={stock} />);
            setModalClass({
              modal: "AddToListModal",
              modalBackground: "AddToListModal__background",
              modalContainer: "AddToListModal__container",
            });
          }}
        >
          <IoIosCheckmark className="StockWatchList__check-mark" />
          Add to Lists
        </button>
      </div>
    </div>
  );
}

export default StockWatchList;
