import "./InvestingPage.css";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectUser } from "../../../../store/session";
import { fetchStockTransactions } from "../../../../store/transactions";

import PortfolioTotal from "./PortfolioTotal";
import PortfolioStocks from "./PortfolioStocks";
import LoadingSpinner from "../../LoadingSpinner";

function InvestingPage() {
  const dispatch = useDispatch();

  const sessionUser = useSelector(selectUser);
  const { stockSummary } = sessionUser;

  const stockInvestments = stockSummary.totalInvestments;
  const balance = Number(stockSummary.balance);
  const total = Number((stockInvestments + balance).toFixed(2));

  const balancePercentage = (balance / total) * 100;
  const stockPercentage = (stockInvestments / total) * 100;

  console.log({
    total,
    balance,
    balancePercentage,
    stockInvestments,
    stockPercentage,
  });

  useEffect(() => {
    dispatch(fetchStockTransactions());
  }, [dispatch]);

  if (stockInvestments.length < 0) return <LoadingSpinner />;
  return (
    <div className="InvestingPage">
      <div>
        <div className="InvestingPage__body">
          <PortfolioTotal
            total={stockInvestments}
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
      </div>
    </div>
  );
}

export default InvestingPage;
