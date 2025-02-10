import "./InvestingPage.css";
// import { GoTriangleDown } from "react-icons/go";
// import { GoTriangleUp } from "react-icons/go";

// import { useNavigate } from "react-router-dom";

function InvestingPage() {
  // const navigate = useNavigate();

  return (
    <div className="InvestingPage">
      <div>
        <div className="InvestingPage__invest-section">
          <div className="InvestingPage__portfolio">
            <span className="InvestingPage__portfolio-title">
              Total Portfolio value
            </span>
            <span className="InvestingPage__portfolio-value">${23.33}</span>
          </div>

          <div className="InvestingPage__invest-section-one">
            <div className="InvestingPage__invest-section-one-left">
              <div className="InvestingPage__data">
                <span className="InvestingPage__data-title">Stocks</span>
                <div className="InvestingPage__data-one">
                  <span className="InvestingPage__data-one-percentage">
                    99.96%
                  </span>
                  <span>$23.11</span>
                </div>
              </div>

              <div className="InvestingPage__data">
                <span className="InvestingPage__data-title">
                  Individual cash
                </span>
                <div className="InvestingPage__data-one IP-Cash">
                  <span className="InvestingPage__data-one-percentage">
                    0.04%
                  </span>
                  <span>$0.01</span>
                </div>
              </div>
            </div>

            <div className="InvestingPage__invest-section-one-right">graph</div>
          </div>

          <div className="InvestingPage__portfolio-two">
            <span className="InvestingPage__portfolio-title-two">Stocks</span>
          </div>
          {/*  */}
          <div className="InvestingPage__invest-section-one">
            <div className="InvestingPage__invest-section-one-left">
              <table className="InvestingPage__stocks__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Shares</th>
                    <th>Price</th>
                    <th>Average Cost</th>
                    <th>Total Return</th>
                    <th>Equity</th>
                  </tr>
                </thead>
                <tbody className="InvestingPage__stocks__table-body">
                  <tr className="InvestingPage__stock-row">
                    <td>apple</td>
                    <td>AAPL</td>
                    <td>20</td>
                    <td>5</td>
                    <td>200</td>
                    <td>
                      <span className="InvestingPage__stocks-table-arrow-container">
                        12
                      </span>
                    </td>
                    <td>200</td>
                    <td></td>
                  </tr>

                  <tr className="InvestingPage__stock-row"></tr>
                </tbody>
              </table>
            </div>

            <div className="InvestingPage__invest-section-one-right">graph</div>
          </div>

          {/*  */}
        </div>
      </div>
    </div>
  );
}

export default InvestingPage;
