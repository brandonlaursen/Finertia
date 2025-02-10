import "./InvestingPage.css";

function InvestingPage() {
  return (
    <div className="InvestingPage">


      <div>
        <div className="InvestingPage__invest-section">
          
          <div className="InvestingPage__portfolio">
            <span className="InvestingPage__portfolio-title">Total Portfolio value</span>
            <span className="InvestingPage__portfolio-value">${23.33}</span>
          </div>

          <div className="InvestingPage__invest-section-one">
            <div className="InvestingPage__invest-section-data">
                <span>Stocks</span>
            </div>
            <div>
              graph
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default InvestingPage;
