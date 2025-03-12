import "./ListStocks.css";

import { useNavigate } from "react-router-dom";

import ListStockItem from "../ListStockItem/ListStockItem";

function ListStocks({
  expandedListIds,
  list,
  stocks,
  sessionUser,
  setShowListSideBar,
  showListSideBar,
}) {
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
                  setShowListSideBar={setShowListSideBar}
                  showListSideBar={showListSideBar}
                />
              );
            })}
        </div>
      )}
    </>
  );
}

export default ListStocks;
