import "./ListStocks.css";

import { useNavigate } from "react-router-dom";
import StockItem from "../StockItem/StockItem";

function ListStocks({ toggleListIds, list, stocks, sessionUser }) {
  const navigate = useNavigate();

  const isListOpen = toggleListIds.includes(list.id);

  const { Stocks } = list;

  const { stockSummary } = sessionUser;

  return (
    <>
      {isListOpen && (
        <div className="WatchListStocks">
          {Stocks &&
            Stocks.map((stock) => {
              return (
                <StockItem
                  key={stock.id}
                  stock={stock}
                  stocks={stocks}
                  stockSummary={stockSummary}
                  navigate={navigate}
                />
              );
            })}
        </div>
      )}
    </>
  );
}

export default ListStocks;
