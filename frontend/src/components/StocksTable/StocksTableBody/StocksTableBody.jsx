import "./StocksTableBody.css";

import Skeleton from "../../Skeleton";
import StocksTableItem from "../StocksTableItem/StocksTableItem";

function StocksTableBody({
  isLoading,
  currentStocks,
  navigate,
  setNotifications,
  setNotificationMessage,
  listId,
  listStocks,
}) {
  if (isLoading) {
    return (
      <tbody className="StocksTable__body">
        {[...Array(5)].map((_, index) => (
          <tr key={index} className="StocksTable__skeleton-row">
            <td colSpan="6">
              <Skeleton width="100%" height="40px" />
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <>
    <tbody className="StocksTable__body">
      {currentStocks.map((stock) => {
        return (
          <StocksTableItem
            key={stock.id}
            stock={stock}
            navigate={navigate}
            setNotifications={setNotifications}
            setNotificationMessage={setNotificationMessage}
            listId={listId}
            listStocks={listStocks}
          />
        );
      })}

    </tbody>
    </>
  );
}

export default StocksTableBody;
