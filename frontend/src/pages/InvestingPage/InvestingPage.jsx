import "./InvestingPage.css";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import PortfolioTotal from "./PortfolioTotal";
import PortfolioStocks from "./PortfolioStocks";
import LoadingSpinner from "../../components/LoadingSpinner";

import { selectUser } from "../../../store/session";
import { fetchStockTransactions } from "../../../store/transactions";

function InvestingPage() {
  const dispatch = useDispatch();

  const sessionUser = useSelector(selectUser);
  const { stockSummary } = sessionUser;

  const stockInvestments = stockSummary.totalInvestments;
  const balance = Number(stockSummary.balance);
  const total = Number((stockInvestments + balance).toFixed(2));

  const balancePercentage = (balance / total) * 100;
  const stockPercentage = (stockInvestments / total) * 100;

  useEffect(() => {
    dispatch(fetchStockTransactions());
  }, [dispatch]);

  if (stockInvestments.length < 0) return <LoadingSpinner />;
  return (
    <div className="InvestingPage">
        <PortfolioTotal
          total={total}
          stockPercentage={stockPercentage}
          stockInvestments={stockInvestments}
          balancePercentage={balancePercentage}
          balance={balance}
        />

        <PortfolioStocks
          stockSummary={stockSummary}
          stockInvestments={stockInvestments}
          balance={balance}
        />
    </div>
  );
}

export default InvestingPage;
