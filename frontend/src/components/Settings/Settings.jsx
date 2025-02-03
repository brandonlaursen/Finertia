import "./Settings.css";

import { Outlet, useLocation, Link } from "react-router-dom";

function Settings() {
  const location = useLocation();
  console.log("location:", location);

  return (
    <div className="Settings">
      <div className="Settings__header">
        <div className="Settings__header__content">
          <span className="Settings__header__username">brandonlaursen</span>
          <div className="Settings__header__section">
            <Link
              to="/account/settings/security"
              className={`
                  Settings__select
                ${
                  location.pathname.includes('settings')
                    ? "Settings__select__active"
                    : ""
                }
                `}
            >
              Settings
            </Link>

            <Link
              to="/account/help"
              className={`
                  Settings__select
                ${
                  location.pathname === "/account/help"
                    ? "Help__select__active"
                    : ""
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

export default Settings;
