import "./SettingsPage.css";

import { Link, Outlet, useLocation } from "react-router-dom";

function SettingsPage() {
  const location = useLocation();

  return (
    <div className="SettingsPage">
      <div className="SettingsPage__aside">
        <div className="SettingsPage__aside__section">
          <span className="SettingsPage__aside__title">
            Account details and options
          </span>
          <Link
            to="/account/settings/security"
            className={`
       SettingsPage__aside__subtitle
        ${
          location.pathname === "/account/settings/security"
            ? "settings-highlight-security"
            : ""
        }`}
          >
            Security and privacy
          </Link>
        </div>
        <div className="SettingsPage__aside__section">
          <span className="SettingsPage__aside__title">
            App preferences
          </span>
          <Link
            to="/account/settings/appearance"
            className={`
        SettingsPage__aside__subtitle
        ${
          location.pathname === "/account/settings/appearance"
            ? "settings-highlight-appearance"
            : ""
        }`}
          >
            App appearance
          </Link>
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default SettingsPage;
