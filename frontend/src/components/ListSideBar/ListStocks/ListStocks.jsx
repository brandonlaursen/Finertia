import "./ListStocks.css";

import { useNavigate } from "react-router-dom";

import ListStockItem from "../ListStockItem/ListStockItem";

function ListStocks({ expandedListIds, list, stocks, sessionUser }) {
  const navigate = useNavigate();

  const isListOpen = expandedListIds.includes(list.id);

  const { Stocks } = list;

  const { stockSummary } = sessionUser;

  return (
    <>
      {isListOpen && (
        <div className="ListStocks">
          {Stocks &&
            Stocks.map((stock) => {
              return (
                <ListStockItem
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
