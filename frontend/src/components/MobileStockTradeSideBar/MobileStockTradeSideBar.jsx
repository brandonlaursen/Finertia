import "./MobileStockTradeSideBar.css";

import { useModal } from "../../context/Modal";

import AddToListModal from "../../modals/AddToListModal/AddToListModal";
import StockTrade from "../StockTradeSideBar/StockTrade/StockTrade";

function MobileStockTradeSideBar({
  stock,
  setNotifications,
  setNotificationMessage,
  showStockTradeSideBar,
  setShowStockTradeSideBar,
}) {
  const { setModalContent, setModalClass } = useModal();

  return (
    <div className="StockTradeBarMobile">
      <div className="StockTradeBarMobile__details">
        <span className="StockTradeBarMobile__symbol">{stock.symbol}</span>
        <span className="StockTradeBarMobile__price">${stock.price}</span>
      </div>

      <div className="StockTradeBarMobile__buttons">
        <button
          className="StockTradeBarMobile__button StockTradeBarMobile__add-to-list-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowStockTradeSideBar(false);
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
          Add To List
        </button>

        <button
          className="StockTradeBarMobile__buy-button"
          onClick={() => {
            setShowStockTradeSideBar(!showStockTradeSideBar);
          }}
        >
          Buy
        </button>
      </div>
      {showStockTradeSideBar && (
        <div className="StockTradeSideBar__mobile-wrapper">
          <StockTrade
            stock={stock}
            setNotifications={setNotifications}
            setNotificationMessage={setNotificationMessage}
            showStockTradeSideBar={showStockTradeSideBar}
            setShowStockTradeSideBar={setShowStockTradeSideBar}
          />
        </div>
      )}
    </div>
  );
}

export default MobileStockTradeSideBar;
