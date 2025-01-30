import { useDispatch, useSelector } from "react-redux";
import "./Stocks.css";
import { useEffect } from "react";
import { getAllStocksData } from "../../../store/stocks";


function Stocks() {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stock.allStocks);
  console.log("stocks:", stocks);

  useEffect(() => {
    dispatch(getAllStocksData());
  }, [dispatch]);

  return (
    <div className="all-stocks-container">

      <div className="all-stocks-header">header</div>


      <div className="all-stocks-body-container">
        <div className="all-stocks-body-left">left</div>
        <div className="all-stocks-body-right">right</div>
      </div>


    </div>
  );
}

export default Stocks;
