import "./StockNotFound.css";

import { useNavigate } from "react-router-dom";

function StockNotFound({ stockSymbol }) {
  const navigate = useNavigate();

  return (
    <div className="StockPage__stock-not-found">

      <div className="StockPage__stock-not-found-image"/>
      <h2>Stock Not Found</h2>
      <p>The stock symbol {`"${stockSymbol}"`} not found.</p>
      <button onClick={() => navigate("/")}>Return to Home</button>
    </div>
  );
}

export default StockNotFound;
