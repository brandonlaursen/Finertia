import "./ProfilePage.css";
import { LuInfo } from "react-icons/lu";

import { useSelector } from "react-redux";

import { selectUser } from "../../../store/session";

import ProfilePageUserInfo from "./ProfilePageUserInfo/ProfilePageUserInfo";

function ProfilePage() {
  const sessionUser = useSelector(selectUser);

  const { stockSummary } = sessionUser;

  const total = stockSummary.totalInvestments + stockSummary.balance;

  return (
    <div className="ProfilePage">
      <ProfilePageUserInfo />

      <section className="ProfilePage__total">
        <span className="ProfilePage__total__balance">
          ${stockSummary?.balance?.toFixed(2)}
        </span>
        Total in Finertia
      </section>

      <section className="ProfilePage__investments">
        <header className="ProfilePage__investments__header">
          <span className="ProfilePage__investments__header__text">
            Individual Investing
          </span>
          <LuInfo className="ProfilePage__investments__header__info-icon" />
        </header>

        <div className="ProfilePage__investments__details">
          <div className="ProfilePage__investments__details__value">
            <span className="ProfilePage__investments__details__value-text">
              Total Individual value
            </span>
            <span className="ProfilePage__investments__details__value-subtext">
              {" "}
              ${total ? total.toFixed(2) : ""}
            </span>
          </div>

          <div className="ProfilePage__investments__details__value ProfilePage__investments__details__subtext">
            <span>Individual holdings</span>$
            {stockSummary.totalInvestments.toFixed(2)}
          </div>

          <div className="ProfilePage__investments__details__value ProfilePage__investments__details__subtext">
            <span>Individual cash</span>${stockSummary.balance.toFixed(2)}
          </div>
        </div>
      </section>

      <section className="ProfilePage__overview">
        <header className="ProfilePage__overview__title">Overview</header>

        <div className="ProfilePage__overview__buttons">
          <button className="ProfilePage__overview__button">
            <span>Stocks</span>
            <span className="ProfilePage__overview__percentage">100%</span>
          </button>
          <button className="ProfilePage__overview__button">
            <span>ETFs</span>
            <span className="ProfilePage__overview__percentage">0%</span>
          </button>
          <button className="ProfilePage__overview__button">
            <span>Options</span>
            <span className="ProfilePage__overview__percentage">0%</span>
          </button>
          <button className="ProfilePage__overview__button">
            <span>Crypto</span>
            <span className="ProfilePage__overview__percentage">0%</span>
          </button>
        </div>

        <div className="ProfilePage__overview__description">
          <span className="ProfilePage__description__text">
            Stocks are pieces of a company that investors can own.
          </span>
          <span className="ProfilePage__description__subtext">Learn More</span>
        </div>
      </section>

      <section className="ProfilePage__buttons">
        <div>Business</div>
        <div>Consumer Goods</div>
        <div>Energy & Water</div>
        <div>Finance</div>
        <div>Healthcare</div>
        <div>Hospitality</div>
        <div>Manufacturing & Materials</div>
        <div>Tech, Media, & Telecom</div>
      </section>

      <section className="ProfilePage__disclaimer">
        <span>
          All investing involves risk, including the loss of principal.
          Brokerage Holdings include securities and related products offered by
          registered broker-dealer Finertia Financial LLC, member SIPC. Crypto
          Holdings are offered by Finertia Crypto, LLC, are not securities, and
          are not covered by SIPC. Finertia Crypto holdings are not offered by
          Finertias broker-dealer and are therefore not subject to the same
          regulatory protections as those offered by Finertia Financial...
        </span>
        <span className="ProfilePage__disclaimer-show-more">Show More</span>
      </section>
    </div>
  );
}

export default ProfilePage;
