import "./WatchListStocks.css";
import { useNavigate } from "react-router-dom";

function WatchListStocks({ toggleListIds, list }) {
  const isListOpen = toggleListIds.includes(list.id);
  const navigate = useNavigate();

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
                  <span className="WatchListStocks__container-title">
                    {stock.stockSymbol}
                  </span>
                  <span className="WatchListStocks__container-graph"></span>
                  <span className="WatchListStocks__container-data">
                    <span className="WatchListStocks__container-price">
                      $10.58
                    </span>
                    <span className="WatchListStocks__container-percent">
                      - 0.42%
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
