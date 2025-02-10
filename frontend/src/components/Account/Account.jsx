import "./Account.css";

import { Outlet, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/session";

function Account() {
  const location = useLocation();
  const sessionUser = useSelector(selectUser);

  return (
    <div className="Account">
      <div className="Account__header">
        <div className="Account__header__content">
          <span className="Account__header__username">{`${sessionUser.firstName} ${sessionUser.lastName}`}</span>
          <div className="Account__header__section">
            <Link
              to="/account/investing"
              className={`
                  account-select
                ${
                  location.pathname === "/account/investing"
                    ? "select-investing"
                    : ""
                }
                `}
            >
              Investing
            </Link>

            <Link
              to="/account/transfers"
              className={`
                  account-select
                ${
                  location.pathname === "/account/transfers"
                    ? "select-transfers"
                    : ""
                }
                `}
            >
              Transfers
            </Link>

            <Link
              to="/account/settings/security"
              className={`
                  account-select
                ${
                  location.pathname.includes("settings")
                    ? "select-settings"
                    : ""
                }
                `}
            >
              Settings
            </Link>

            <Link
              to="/account/help"
              className={`
                  account-select
                ${location.pathname === "/account/help" ? "select-help" : ""}
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

export default Account;
