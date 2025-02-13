import "./ListStocks.css";

import { useNavigate } from "react-router-dom";

function ListStocks({ toggleListIds, list, stocks, sessionUser }) {
  const navigate = useNavigate();

  const isListOpen = toggleListIds.includes(list.id);

  return (
    <>
      {isListOpen && (
        <div className="WatchListStocks">
          {list?.Stocks &&
            list?.Stocks?.map((stock) => {
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
                      {sessionUser?.stockSummary[
                        stock.stockSymbol
                      ]?.sharesOwned?.toFixed(2)
                        ? `${sessionUser?.stockSummary[
                            stock.stockSymbol
                          ]?.sharesOwned?.toFixed(2)} Shares`
                        : ""}
                    </span>
                  </div>
                  <span className="WatchListStocks__container-graph"></span>
                  <span className="WatchListStocks__container-data">
                    <span className={`WatchListStocks__container-price`}>
                      ${stocks[stock.id]?.current_price}
                    </span>
                    <span
                      className={`WatchListStocks__container-percent ${
                        stocks[stock.id]?.todays_change_percent.toFixed(2) > 0
                          ? "WatchListStocks__percent-green"
                          : "WatchListStocks__percent-red"
                      }`}
                    >
                      {stocks[stock.id]?.todays_change_percent.toFixed(2) > 0 &&
                        "+"}
                      {stocks[stock.id]?.todays_change_percent.toFixed(2)}%
                    </span>
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}

export default ListStocks;
