import "./WatchListStocks.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAllStocks } from "../../../../store/stocks";
function WatchListStocks({ toggleListIds, list }) {
  console.log("list:", list);
  const isListOpen = toggleListIds.includes(list.id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stocks.allStocks);
  console.log("stocks:", stocks);

  useEffect(() => {
    dispatch(fetchAllStocks());
  }, [dispatch]);

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
                      1 share
                    </span>
                  </div>
                  <span className="WatchListStocks__container-graph"></span>
                  <span className="WatchListStocks__container-data">
                    <span className={`WatchListStocks__container-price`}>
                      ${stocks[stock.id].current_price}
                    </span>
                    <span
                      className={`WatchListStocks__container-percent ${
                        stocks[stock.id].todays_change_percent.toFixed(2) > 0
                          ? "WatchListStocks__percent-green"
                          : "WatchListStocks__percent-red"
                      }`}
                    >
                      {stocks[stock.id].todays_change_percent.toFixed(2) > 0 &&
                        "+"}
                      {stocks[stock.id].todays_change_percent.toFixed(2)}%
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

export default WatchListStocks;
