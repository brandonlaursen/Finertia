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

  const stockInvestments = Object.values(stockSummary).reduce(
    (total, stock) => (total += stock.averageCost * stock.sharesOwned),
    0
  );

  let { balance } = sessionUser;
  const total = balance + stockInvestments;

  const stockPercentage = Math.round((stockInvestments / total) * 100).toFixed(
    2
  );
  const balancePercentage = Math.round((balance / total) * 100).toFixed(2);

  useEffect(() => {
    dispatch(fetchStockTransactions());
  }, [dispatch]);

  if (stockInvestments.length < 0) return <LoadingSpinner />;
  return (
    <div className="InvestingPage">
      <div>
        <div className="InvestingPage__body">
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
      </div>
    </div>
  );
}

export default InvestingPage;
