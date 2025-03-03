
import { useNavigate } from "react-router-dom";

import StockItem from "../StockItem/StockItem";


function StocksOwned({ sessionUser, stocks }) {
  const navigate = useNavigate();

  const {
    stockSummary: { stocksOwned },
  } = sessionUser;

  const stocksOwnedArray = Object.values(stocksOwned);

  return (
    <>
      {
        <div className="StockListItems">
          {stocksOwnedArray.length > 0 ? (
            stocksOwnedArray.map((stock) => {
              return (
                <StockItem
                  key={stock.id}
                  stock={stock}
                  navigate={navigate}
                  stocks={stocks}
                />
              );
            })
          ) : (
            <div className="StockListItems__empty">
              Your portfolio is waiting to grow! 🚀 Start exploring stocks and
              make your first investment today.
            </div>
          )}
        </div>
      }
    </>
  );
}

export default StocksOwned;
