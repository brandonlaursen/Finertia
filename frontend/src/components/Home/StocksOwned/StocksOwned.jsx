import "./StocksOwned.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../store/session";
import { useNavigate } from "react-router-dom";

function StocksOwned({allStocks}) {
  const navigate = useNavigate();

  const { stockSummary } = useSelector(selectUser);

  const stocks = Object.values(stockSummary);

  return (
    <>
      <div className="WatchListStocks-stocks-owned">

        {stocks.length > 0 &&
          stocks.map((stock) => {
            return (
              <div
                className="WatchListStocks__container"
                key={stock.id}
                onClick={() => navigate(`/stocks/${stock?.stockSymbol}`)}
              >
                <div className="WatchListStocks__container-title-shares">
                  <span className="WatchListStocks__container-title">
                    {stock.stockSymbol}
                  </span>
                  <span className="WatchListStocks__container-subtitle">
                    {stock.sharesOwned?.toFixed(2)
                      ? `${stock.sharesOwned?.toFixed(2)} Shares`
                      : ""}
                  </span>
                </div>
                <span className="WatchListStocks__container-graph"></span>
                <span className="WatchListStocks__container-data">
                  <span className={`WatchListStocks__container-price`}>
                    ${allStocks[stock.stockId]?.current_price.toFixed(2)}
                  </span>
                  <span
                    className={`WatchListStocks__container-percent ${
                      allStocks[stock.stockId]?.todays_change_percent.toFixed(
                        2
                      ) > 0
                        ? "WatchListStocks__percent-green"
                        : "WatchListStocks__percent-red"
                    }`}
                  >
                    {allStocks[stock.stockId]?.todays_change_percent.toFixed(
                      2
                    ) > 0 && "+"}
                    {allStocks[stock.stockId]?.todays_change_percent.toFixed(2)}
                    %
                  </span>
                </span>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default StocksOwned;
