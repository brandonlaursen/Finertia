import "./SettingsPage.css";

import { Link, Outlet, useLocation } from "react-router-dom";

function SettingsPage() {
  const location = useLocation();
  console.log("hello", location.pathname);
  return (
    <div className="Settings__main">
      <div className="Settings__main__aside">
        <div className="Settings__main__aside__section">
          <span className="Settings__main__aside__title">
            Account details and options
          </span>
          <Link
            to="/account/settings/security"
            className={`
        Settings__main__aside__subtitle
        ${
          location.pathname === "/account/settings/security"
            ? "settings-highlight-security"
            : ""
        }`}
          >
            Security and privacy
          </Link>
        </div>
        <div className="Settings__main__aside__section">
          <span className="Settings__main__aside__title">App preferences</span>
          <Link
            to="/account/settings/appearance"
            className={`
        Settings__main__aside__subtitle
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
