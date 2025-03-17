import "./StockTradeSidebar.css";

import StockTrade from "./StockTrade/StockTrade";
import AddToListButton from "./AddToListButton/AddToListButton";

function StockTradeSidebar({
  stock,
  setNotifications,
  setNotificationMessage,
  showStockTradeSideBar = false,
  setShowStockTradeSideBar = null,
}) {
  return (
    <div className="StockTradeSidebar">
      <main className="StockTradeSidebar__main">
        <StockTrade
          stock={stock}
          setNotifications={setNotifications}
          setNotificationMessage={setNotificationMessage}
          showStockTradeSideBar={showStockTradeSideBar}
          setShowStockTradeSideBar={setShowStockTradeSideBar}
        />

        <AddToListButton
          stock={stock}
          setNotifications={setNotifications}
          setNotificationMessage={setNotificationMessage}
        />
      </main>
    </div>
  );
}

export default StockTradeSidebar;
