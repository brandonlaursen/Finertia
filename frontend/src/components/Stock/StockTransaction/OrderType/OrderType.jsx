import "./OrderType.css";
import { MdInfoOutline } from "react-icons/md";

function OrderType({ transactionType }) {
  return (
    <div className="StockTransaction__order-section">
      <div className="StockTransaction__order-section__text">
        <span>Order Type</span>
        <span className="StockTransaction__order-section__subtext">
          Limit <MdInfoOutline className="StockTransaction__info-icon" />
        </span>
      </div>

      <div className="StockTransaction__order-section__select">
        <div className="StockTransaction__order-section__container">
          <span>{transactionType === "buy" ? "Buy Order" : "Sell Order"}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderType;
