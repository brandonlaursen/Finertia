import "./StockTradeEstimate.css";
import { MdInfoOutline } from "react-icons/md";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { executeStockTrade } from "../../../../../store/transactions";

import TransferModal from "../../../Modals/TransferModal";
import { useModal } from "../../../../context/Modal";

function StockTradeEstimate({
  buyIn,
  estimatedShares,
  transactionType,
  estimatedCost,
  showReview,
  errors,
  handleStockTransaction,
  message,
  clearReview,
  price,
  stock,
  sharesToTrade,
  setNotifications,
  setNotificationMessage,
  setSharesToTrade,
  setTradeAmount,
}) {
  const dispatch = useDispatch();

  const { setModalContent, setModalClass } = useModal();

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmitDelay() {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    handleStockTransaction();
  }

  console.log("stock!!!!!", stock);
  async function handleSubmitOrder() {
    if (errors) return;

    const numberOfShares =
      buyIn === "Dollars" ? estimatedShares : sharesToTrade;

    const transaction = {
      stockId: stock.id,
      price,
      stockName: stock.name,
      stockSymbol: stock.symbol,
      quantity: Number(numberOfShares).toFixed(5),
      transactionType,
    };

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);

    dispatch(executeStockTrade(transaction));
    clearReview();

    if (transactionType === "buy") {
      setNotificationMessage([
        `Successfully bought ${transaction.quantity} shares of ${stock.name}`,
      ]);
    } else if (transactionType === "sell") {
      setNotificationMessage([
        `Successfully sold ${transaction.quantity} shares of ${stock.name}`,
      ]);
    }

    setTradeAmount(0);
    setSharesToTrade(0);

    setNotifications(true);

    await new Promise((resolve) => {
      setTimeout(() => {
        setNotifications(false);
        resolve();
      }, 10000);
    });
    setNotificationMessage([]);
  }

  function handleDeposit(e) {
    e.stopPropagation();
    setModalContent(<TransferModal />);
    setModalClass({
      modal: "TransferModal",
      modalBackground: "TransferModal__background",
      modalContainer: "TransferModal__container",
    });
    clearReview();
  }

  return (
    <>
      <div className="StockTransaction__estimate">
        {buyIn === "Dollars" ? (
          <>
            <span>Est.Quantity</span>
            <span className="StockTransaction__estimate-amount">
              {Number(estimatedShares).toFixed(5)}
            </span>
          </>
        ) : (
          <>
            {transactionType === "buy" ? (
              <span>Estimated Cost</span>
            ) : (
              <span>Estimated Credit</span>
            )}

            <span className="StockTransaction__estimate-amount">
              ${Number(estimatedCost).toFixed(2)}
            </span>
          </>
        )}
      </div>
      {showReview && (
        <>
          {errors && (
            <div className="StockTradeEstimate__errors">
              <span className="StockTradeEstimate__error">
                <MdInfoOutline className="StockTradeEstimate__error-icon" />
                {errors[0]}
              </span>
              <span className="StockTradeEstimate__error-subtext">
                {errors[1]}
              </span>
            </div>
          )}
          {message && (
            <div className="StockTradeEstimate__errors">
              <span className="StockTradeEstimate__message">{message}</span>
            </div>
          )}
        </>
      )}

      <div className="StockTransaction__button-container">
        {showReview && errors && (
          <>
            {transactionType === "buy" &&
              errors[0] === "Not Enough Buying Power" && (
                <button
                  className="StockTransaction__button"
                  onClick={handleDeposit}
                >
                  Make Deposit
                </button>
              )}
            <button
              className="StockTransaction__button"
              onClick={() => {
                clearReview();
              }}
            >
              Dismiss
            </button>
          </>
        )}

        {showReview && !errors && (
          <div className="StockTransaction__confirm-container">
            <button
              className="StockTransaction__button"
              onClick={handleSubmitOrder}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="StockTransaction__spinner"></span>
              ) : (
                "Submit Order"
              )}
            </button>
            <button
              className="StockTransaction__button"
              onClick={() => {
                clearReview();
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {!showReview && (
          <button
            className="StockTransaction__button"
            onClick={handleSubmitDelay}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="StockTransaction__spinner"></span>
            ) : (
              "Review Order"
            )}
          </button>
        )}
      </div>
    </>
  );
}

export default StockTradeEstimate;
