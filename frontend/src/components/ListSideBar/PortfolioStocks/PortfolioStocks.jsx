import "./PortfolioStocks.css";

import { useNavigate } from "react-router-dom";

import ListStockItem from "../ListStockItem/ListStockItem";

function PortfolioStocks({ sessionUser, stocks }) {
  const navigate = useNavigate();

  const {
    stockSummary: { stocksOwned },
  } = sessionUser;

  const stocksOwnedArray = Object.values(stocksOwned);

  return (
    <div className="PortfolioStocks">
      <header className="PortfolioStocks__header">
        <span>Stocks</span>
      </header>

      {
        <div className="PortfolioStocks__container">
          {stocksOwnedArray.length > 0 ? (
            stocksOwnedArray.map((stock) => {
              return (
                <ListStockItem
                  key={stock.id}
                  stock={stock}
                  navigate={navigate}
                  stocks={stocks}
                />
              );
            })
          ) : (
            <div className="PortfolioStocks__empty">
              Your portfolio is waiting to grow! 🚀 Start exploring stocks and
              make your first investment today.
            </div>
          )}
        </div>
      }
    </div>
  );
}

export default PortfolioStocks;
