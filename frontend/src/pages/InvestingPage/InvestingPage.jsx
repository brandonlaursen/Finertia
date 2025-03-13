import "./InvestingPage.css";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import InvestingPortfolio from "./InvestingPortfolio";
import InvestingStocks from "./InvestingStocks/InvestingStocks";
import LoadingSpinner from "../../components/LoadingSpinner";

import { selectUser } from "../../../store/session";
import { fetchStockTransactions } from "../../../store/transactions";

function InvestingPage() {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionUser = useSelector(selectUser);
  const stockSummary = sessionUser?.stockSummary || {};

  useEffect(() => {
    async function fetchData() {
      try {
        await dispatch(fetchStockTransactions());
      } catch (err) {
        setError("Failed to load stock transactions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [dispatch]);

  const stockInvestments = Number(stockSummary?.totalInvestments) || 0;
  const balance = Number(stockSummary?.balance) || 0;
  const total = stockInvestments + balance;

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="InvestingPage__error">{error}</div>;

  return (
    <div className="InvestingPage">
      <InvestingPortfolio
        total={total}
        stockInvestments={stockInvestments}
        balance={balance}
      />

      <InvestingStocks
        stockSummary={stockSummary}
        stockInvestments={stockInvestments}
        balance={balance}
      />
    </div>
  );
}

export default InvestingPage;
