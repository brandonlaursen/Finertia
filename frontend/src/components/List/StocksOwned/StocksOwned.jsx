import "./StocksOwned.css";

import { useNavigate } from "react-router-dom";

import StocksOwnedItem from "../StocksOwnedItem/StocksOwnedItem";

function StocksOwned({ sessionUser, stocks }) {
  const navigate = useNavigate();

  const {
    stockSummary: { stocksOwned },
  } = sessionUser;

  const stocksOwnedArray = Object.values(stocksOwned);

  return (
    <>
      {
        <div className="WatchListStocks-stocks-owned">
          {stocksOwnedArray.length > 0 ? (
            stocksOwnedArray.map((stock) => {
              return (
                <StocksOwnedItem
                  key={stock.id}
                  stock={stock}
                  navigate={navigate}
                  stocks={stocks}
                />
              );
            })
          ) : (
            <div className="WatchListStocks-stocks-owned-empty">
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
