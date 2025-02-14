import "./HomePage.css";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";

import { selectUser } from "../../../../store/session";
import { useSelector } from "react-redux";
import { useState } from "react";

import NewsFeed from "../NewsFeed";
import TransferModal from "../../Modals/TransferModal/TransferModal";
import ListContainer from "../../List/ListContainer";

import HomePageChart from "./HomePageChart/HomePageChart";

import { useModal } from "../../../context/Modal";
import {  useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const sessionUser = useSelector(selectUser);
  const { setModalContent, setModalClass } = useModal();

  const { stockSummary } = sessionUser;
  const stockInvestments = Object.values(stockSummary).reduce(
    (total, stock) => (total += stock.averageCost * stock.sharesOwned),
    0
  );
  const [dropDownVisible, setDropDownVisible] = useState(false);

  return (
    <div className="HomePage">
      <div className="HomePage__body">
        <div className="HomePage__main">
          <div className="HomePage__main__section">
            <div className="HomePage__main__title">Investing</div>
            <div className="HomePage__main__banner">
              <div className="HomePage__main__user-info">
                <span>${stockInvestments.toFixed(2)}</span>
              </div>
              <div className="HomePage__main__chart-container">
                <HomePageChart />
              </div>
              <div
                className="HomePage__main__buying-power"
                onClick={() => setDropDownVisible(!dropDownVisible)}
              >
                <span>Buying Power</span>
                <span className="HomePage__main__buying-power-span">
                  ${sessionUser.balance}
                  {dropDownVisible ? <FaAngleUp /> : <FaAngleDown />}
                </span>
              </div>
              {dropDownVisible && (
                <div className="HomePage__main__buying-power__dropdown">
                  <div className="HomePage__main__dropdown-contents">
                    <div className="dropdown-contents-text-container">
                      <div className="dropdown-contents-text">
                        <span>Individual Cash</span>
                        <span>${sessionUser.balance}</span>
                      </div>
                      <div className="dropdown-contents-text">
                        <span>Total</span>
                        <span>${sessionUser.balance}</span>
                      </div>
                    </div>

                    <div className="dropdown-contents-text-button-container">
                      <button
                        className="dropdown-contents-text-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalContent(<TransferModal />);
                          setModalClass({
                            modal: "TransferModal",
                            modalBackground: "TransferModal__background",
                            modalContainer: "TransferModal__container",
                          });
                        }}
                      >
                        Deposit Funds
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="HomePage__main__subtitle">Welcome to Finertia</div>
          </div>

          <NewsFeed />
        </div>

        <ListContainer className="WatchList-HomePage-container" navigate={navigate} />
      </div>
    </div>
  );
}

export default HomePage;
