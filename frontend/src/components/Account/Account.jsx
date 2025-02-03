import "./Account.css";

import { Outlet, useLocation, Link } from "react-router-dom";

function Account() {
  const location = useLocation();
  console.log("location:", location);

  return (
    <div className="Account">
      <div className="Account__header">
        <div className="Account__header__content">
          <span className="Account__header__username">brandonlaursen</span>
          <div className="Account__header__section">
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
