import "./PortfolioStocks.css";

import { useNavigate } from "react-router-dom";

import ListStockItem from "../ListStockItem/ListStockItem";

function PortfolioStocks({ sessionUser, stocks }) {
  const navigate = useNavigate();


  const stocksOwned = sessionUser?.stockSummary?.stocksOwned || {}; // Default to an empty object if undefined


  const stocksOwnedArray = stocksOwned ? Object.values(stocksOwned) : [];

  return (
    <div className="PortfolioStocks">
      <header className="PortfolioStocks__header">
        <span>Stocks</span>
      </header>

      <section className="PortfolioStocks__container">
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
      </section>
    </div>
  );
}

export default PortfolioStocks;
