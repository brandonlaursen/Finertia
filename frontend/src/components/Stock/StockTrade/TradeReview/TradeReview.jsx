import "./TradeReview.css";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { executeStockTrade } from "../../../../../store/transactions";

import TransferModal from "../../../Modals/TransferModal";

import { useModal } from "../../../../context/Modal";

function TradeReview({
  buyIn,
  estimatedShares,
  transactionType,
  showReview,
  errors,
  handleStockTransaction,
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

  async function handleSubmitDelay() {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    handleStockTransaction();
  }

  async function handleSubmitOrder() {
    if (errors) return;

    const numberOfShares =
      buyIn === "Dollars" ? estimatedShares : sharesToTrade;

    const transaction = {
      stockId: stock.id,
      stockSymbol: stock.symbol,
      stockName: stock.name,
      stockPrice: price,
      quantity: Number(numberOfShares).toFixed(5),
      transactionType,
    };

    dispatch(executeStockTrade(transaction));
    clearReview();

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

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

  return (
    <div className="TradeReview">
      {showReview && errors && (
        <>
          {transactionType === "buy" &&
            errors[0] === "Not Enough Buying Power" && (
              <button
                className="TradeReview__button"
                onClick={handleDeposit}
              >
                Make Deposit
              </button>
            )}
          <button
            className="TradeReview__button"
            onClick={() => {
              clearReview();
            }}
          >
            Dismiss
          </button>
        </>
      )}

      {showReview && !errors && (
        <div className="TradeReview__confirmation">
          <button
            className="TradeReview__button"
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
            className="TradeReview__button"
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
          className="TradeReview__button"
          onClick={handleSubmitDelay}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="TradeReview__spinner"></span>
          ) : (
            "Review Order"
          )}
        </button>
      )}
    </div>
  );
}

export default TradeReview;
