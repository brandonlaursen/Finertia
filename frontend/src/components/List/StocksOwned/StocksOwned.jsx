import "./StocksOwned.css";

import { useNavigate } from "react-router-dom";

import StocksOwnedItem from "../StocksOwnedItem/StocksOwnedItem";


function StocksOwned({ sessionUser, stocks }) {
  const navigate = useNavigate();

  const { stockSummary } = sessionUser;

  const ownedStocks = Object.values(stockSummary);

  return (
    <>
      <div className="WatchListStocks-stocks-owned">
        {ownedStocks.length > 0 &&
          ownedStocks.map((stock) => {
            return (
              <StocksOwnedItem
                key={stock.id}
                stock={stock}
                navigate={navigate}
                stocks={stocks}
              />
            );
          })}
      </div>
    </>
  );
}

export default StocksOwned;
