import "./TradeReview.css";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { executeStockTrade } from "../../../../../store/transactions";

import TransferModal from "../../../../modals/TransferModal";

import { useModal } from "../../../../context/Modal";

function TradeReview({
  stock,
  balance,
  sharesOwned,
  price,
  tradeUnit,
  tradeType,
  tradeAmount,
  setTradeAmount,
  sharesToTrade,
  setSharesToTrade,
  tradeCostEstimate,
  tradeSharesEstimate,
  handleStockTrade,
  showReview,
  setShowReview,
  clearReview,
  errors,
  setErrors,
  setMessages,
  setNotifications,
  setNotificationMessage,
  setReviewingTrade
}) {
  const dispatch = useDispatch();
  const { setModalContent, setModalClass } = useModal();

  const [isLoading, setIsLoading] = useState(false);

  function handleDeposit(e) {
    e.stopPropagation();
    setModalContent(
      <TransferModal
        setNotifications={setNotifications}
        setNotificationMessage={setNotificationMessage}
      />
    );
    setModalClass({
      modal: "TransferModal",
      modalBackground: "TransferModal__background",
      modalContainer: "TransferModal__container",
    });
    clearReview();
  }

  async function handleStockTradeReview() {
    setReviewingTrade(true);
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    handleStockTrade({
      stock,
      balance,
      sharesOwned,
      tradeUnit,
      tradeType,
      tradeAmount,
      sharesToTrade,
      tradeCostEstimate,
      tradeSharesEstimate,
      showReview,
      setShowReview,
      errors,
      setErrors,
      setMessages,
    });
  }

  async function handleExecuteStockTrade() {
    if (errors) return;

    const numberOfShares =
      tradeUnit === "Dollars" ? tradeSharesEstimate : sharesToTrade;

    const transaction = {
      stockId: stock.id,
      stockSymbol: stock.symbol,
      stockName: stock.name,
      stockPrice: price,
      quantity: Number(numberOfShares).toFixed(5),
      tradeType,
    };

    setIsLoading(true);
    try {
      const result = await dispatch(executeStockTrade(transaction));

      if (result.success) {
        clearReview();

        // Show success notification
        if (tradeType === "buy") {
          setNotificationMessage([
            `Successfully bought ${transaction.quantity} shares of ${stock.name}.`,
          ]);
        } else if (tradeType === "sell") {
          setNotificationMessage([
            `Successfully sold ${transaction.quantity} shares of ${stock.name}.`,
          ]);
        }

        // Reset form
        setTradeAmount("");
        setSharesToTrade("");
        setNotifications(true);

        // Hide notification after 10 seconds
        setTimeout(() => {
          setNotifications(false);
          setNotificationMessage([]);
        }, 5000);
        setReviewingTrade(false);
      } else {
        setErrors(["Failed to execute trade. Please try again."]);
      }
    } catch (error) {
      setErrors(["An error occurred while executing the trade."]);
      console.error("Trade execution error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="TradeReview">
      {showReview && errors && (
        <>
          {tradeType === "buy" && errors[0] === "Not Enough Buying Power." && (
            <button className="TradeReview__button TradeReview__deposit-button" onClick={handleDeposit}>
              Make Deposit
            </button>
          )}
          <button className="TradeReview__button TradeReview__dismiss-button" onClick={clearReview}>
            Dismiss
          </button>
        </>
      )}

      {showReview && !errors && (
        <div className="TradeReview__confirmation">
          <button
            className="TradeReview__button"
            onClick={handleExecuteStockTrade}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="StockTransaction__spinner"></span>
            ) : (
              "Submit Order"
            )}
          </button>
          <button className="TradeReview__button" onClick={clearReview}>
            Cancel
          </button>
        </div>
      )}

      {!showReview && (
        <button
          className="TradeReview__button TradeReview__review-button"
          onClick={handleStockTradeReview}
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
