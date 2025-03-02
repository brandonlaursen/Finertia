import "./AccountLayout.css";

import { Outlet, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectUser } from "../../../../store/session";

function AccountLayout() {
  const location = useLocation();
  const sessionUser = useSelector(selectUser);

  return (
    <div className="AccountLayout">
      <div className="AccountLayout__body">
        <div className="AccountLayout__main">
          <span className="AccountLayout__username">{`${sessionUser.firstName} ${sessionUser.lastName}`}</span>
          <div className="AccountLayout__section">
            <Link
              to="/account/investing"
              className={`
                  AccountLayout__select
                ${
                  location.pathname === "/account/investing" &&
                  "AccountLayout__selected"
                }
                `}
            >
              Investing
            </Link>

            <Link
              to="/account/transfers"
              className={`
                  AccountLayout__select
                ${
                  location.pathname === "/account/transfers" &&
                  "AccountLayout__selected"
                }
                `}
            >
              Transfers
            </Link>

            <Link
              to="/account/history"
              className={`
                  AccountLayout__select
                ${
                  location.pathname === "/account/history" &&
                  "AccountLayout__selected"
                }
                `}
            >
              History
            </Link>

            <Link
              to="/account/settings/security"
              className={`
                  AccountLayout__select
                ${
                  location.pathname.includes("settings") &&
                  "AccountLayout__selected"
                }
                `}
            >
              Settings
            </Link>

            <Link
              to="/account/help"
              className={`
                  AccountLayout__select
                ${
                  location.pathname === "/account/help" &&
                  "AccountLayout__selected"
                }
                `}
            >
              Help
            </Link>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default AccountLayout;
