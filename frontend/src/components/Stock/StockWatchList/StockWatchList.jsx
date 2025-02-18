import "./StockWatchList.css";
import { IoIosCheckmark } from "react-icons/io";

import StockTransaction from "../StockTransaction/StockTransaction";
import AddToListModal from "../../Modals/AddToListModal/AddToListModal";

import { useModal } from "../../../context/Modal";

function StockWatchList({ stock, setNotifications, setNotificationMessage }) {
  const { setModalContent, setModalClass } = useModal();

  return (
    <>
      <div className="StockWatchList">
        <div className="StockWatchList__container">
          <StockTransaction
            stock={stock}
            setNotifications={setNotifications}
            setNotificationMessage={setNotificationMessage}
          />

          <button
            className="StockWatchList__button"
            onClick={(e) => {
              e.stopPropagation();
              setModalContent(
                <AddToListModal
                  stock={stock}
                  setNotifications={setNotifications}
                  setNotificationMessage={setNotificationMessage}
                />
              );
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
    </>
  );
}

export default StockWatchList;
