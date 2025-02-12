import "./StockTransaction.css";
import { MdInfoOutline } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../../../store/session";
import { TiArrowUnsorted } from "react-icons/ti";
import { GrFormCheckmark } from "react-icons/gr";
import { getStockTransactions, buyStock } from "../../../../store/transactions";

function StockTransaction({ stock }) {
  const dispatch = useDispatch();

  const sessionUser = useSelector(selectUser);
  const stockTransactions = useSelector(
    (state) => state.transactions.stockTransactions
  );
  // console.log("stockTransactions:", stockTransactions);

  const [amount, setAmount] = useState(0.0);
  const [shares, setShares] = useState(0);
  const [estimate, setEstimate] = useState(0);
  const [estimateCost, setEstimateCost] = useState(0);
  const [buyIn, setBuyIn] = useState("Dollars");
  const [buyInDropdown, setBuyInDropdown] = useState(false);

  const { price } = stock;

  const buyInRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (buyInRef.current && !buyInRef.current.contains(e.target)) {
        setBuyInDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function handleAmountChange(e) {
    const value = e.target.value;
    const number = Number(value);
    setAmount(number);
  }

  async function handleStockTransaction() {
    let quantity;
    if (buyIn === "Dollars") {
      quantity = estimate;
    } else if (buyIn === "Shares") {
      quantity = shares;
    }

    const transaction = {
      stockId: +stock.id,
      price: +stock.price,
      quantity: +quantity,
    };


    await dispatch(buyStock(transaction));
    return;
  }

  // useEffect(() => {
  //   console.log('fetching....')
  //   dispatch(getStockTransactions());
  // },[dispatch])

  useEffect(() => {
    const newEstimate = amount.toFixed(2) / price.toFixed(2);
    setEstimate(newEstimate.toFixed(2));
  }, [amount, price]);

  useEffect(() => {
    const newEstimatedCost = shares * price.toFixed(2);
    setEstimateCost(newEstimatedCost);
  }, [shares, price]);

  return (
    <div className="StockTransaction">
      <div className="StockTransaction__header">Buy {stock.symbol}</div>

      <div className="StockTransaction__body">
        <div className="StockTransaction__order-section">
          <div className="StockTransaction__order-section__text">
            <span>Order Type</span>
            <span className="StockTransaction__order-section__subtext">
              Limit <MdInfoOutline className="StockTransaction__info-icon" />
            </span>
          </div>

          <div className="StockTransaction__order-section__select">
            <div className="StockTransaction__order-section__container">
              <span>Buy Order</span>
            </div>
          </div>
        </div>

        <div className="StockTransaction__order-section">
          <div className="StockTransaction__order-section__text">
            <span>Buy in</span>
          </div>

          <div className="StockTransaction__order-section__select">
            <div
              className={`StockTransaction__order-section__container  ${
                buyInDropdown && "buyInDropDownBorder"
              }`}
              onClick={() => setBuyInDropdown(!buyInDropdown)}
              ref={buyInRef}
            >
              <span>{buyIn}</span>
              <TiArrowUnsorted />
            </div>
            {buyInDropdown && (
              <div className={`BuyInDropdown`}>
                <div
                  className={`BuyInDropdown-option ${
                    buyIn === "Dollars" && "BuyInDropdown-option-hover"
                  }`}
                >
                  <div className="checkmark-div">
                    {buyIn === "Dollars" && (
                      <GrFormCheckmark className="TransferModal__checkmark" />
                    )}
                  </div>

                  <span onClick={() => setBuyIn("Dollars")}>Dollars</span>
                </div>
                <div
                  className={`BuyInDropdown-option ${
                    buyIn === "Shares" && "BuyInDropdown-option-hover"
                  }`}
                >
                  <div className="checkmark-div">
                    {buyIn === "Shares" && (
                      <GrFormCheckmark className="TransferModal__checkmark" />
                    )}
                  </div>

                  <span onClick={() => setBuyIn("Shares")}>Shares</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="StockTransaction__order-section">
          {buyIn === "Dollars" ? (
            <>
              <div className="StockTransaction__order-section__text">
                <span>Amount</span>
              </div>

              <div className={`StockTransaction__input-wrapper`}>
                <span className="StockTransaction__dollar-sign">$</span>
                <input
                  type="number"
                  pattern="[0-9]*"
                  value={amount}
                  placeholder="0.0"
                  className="StockTransaction__amount-input"
                  onChange={handleAmountChange}
                />
              </div>
            </>
          ) : (
            <>
              <div className="StockTransaction__order-section__text">
                <span>Shares</span>
              </div>
              <div className={`StockTransaction__input-wrapper`}>
                <input
                  type="number"
                  pattern="[0-9]*"
                  value={shares}
                  placeholder="0"
                  className="StockTransaction__amount-input"
                  onChange={(e) => setShares(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        {buyIn === "Shares" && (
          <div className="StockTransaction__market-price">
            <span className="StockTransaction__market-price-title">
              Market Price
            </span>
            <span>${stock.price}</span>
          </div>
        )}
        <div className="StockTransaction__line"></div>
      </div>

      <div className="StockTransaction__estimate">
        {buyIn === "Dollars" ? (
          <>
            <span>Est.Quantity</span>
            <span className="StockTransaction__estimate-amount">
              {Number(estimate).toFixed(2)}
            </span>
          </>
        ) : (
          <>
            <span>Estimated Cost</span>
            <span className="StockTransaction__estimate-amount">
              ${Number(estimateCost).toFixed(2)}
            </span>
          </>
        )}
      </div>

      <div className="StockTransaction__button-container">
        <button
          className="StockTransaction__button"
          onClick={handleStockTransaction}
        >
          Review Order
        </button>
      </div>

      <div className="StockTransaction_footer">
        {/* ${sessionUser.balance.toFixed(2)} buying power available */}
      </div>
    </div>
  );
}

export default StockTransaction;
