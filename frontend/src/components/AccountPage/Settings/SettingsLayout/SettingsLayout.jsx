import "./SettingsLayout.css";

import { Link, Outlet, useLocation } from "react-router-dom";

function SettingsLayout() {
  const location = useLocation();

  return (
    <div className="SettingsLayout">
      <div className="SettingsLayout__aside">
        <div className="SettingsLayout__aside__section">
          <span className="SettingsLayout__aside__title">
            Account details and options
          </span>
          <Link
            to="/account/settings/security"
            className={`
       SettingsLayout__aside__subtitle
        ${
          location.pathname === "/account/settings/security" &&
          "settings-highlight-security"
        }`}
          >
            Security and privacy
          </Link>
        </div>
        <div className="SettingsLayout__aside__section">
          <span className="SettingsLayout__aside__title">App preferences</span>
          <Link
            to="/account/settings/appearance"
            className={`
        SettingsLayout__aside__subtitle
        ${
          location.pathname === "/account/settings/appearance" &&
          "settings-highlight-appearance"
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

export default SettingsLayout;
