import "./StockTradeSidebar.css";
import { IoIosCheckmark } from "react-icons/io";

import StockTrade from "./StockTrade/StockTrade";
import AddToListModal from "../../modals/AddToListModal/AddToListModal";

import { useModal } from "../../context/Modal";

function StockTradeSidebar({
  stock,
  setNotifications,
  setNotificationMessage,
}) {
  const { setModalContent, setModalClass } = useModal();

  return (
    <div className="StockTradeSidebar">
      <main className="StockTradeSidebar__main">
        <StockTrade
          stock={stock}
          setNotifications={setNotifications}
          setNotificationMessage={setNotificationMessage}
        />

        <button
          className="StockTradeSidebar__add-to-list-button"
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
          <IoIosCheckmark className="StockTradeSidebar__check-mark-icon" />
          Add to Lists
        </button>
      </main>
    </div>
  );
}

export default StockTradeSidebar;
