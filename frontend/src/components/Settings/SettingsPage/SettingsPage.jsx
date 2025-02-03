import "./SettingsPage.css";

import { Link, Outlet } from "react-router-dom";

function SettingsPage() {
  console.log("hello");
  return (
    <div className="Settings__main">
      <div className="Settings__main__aside">
        <div className="Settings__main__aside__section">
          <span className="Settings__main__aside__title">
            Account details and options
          </span>
          <Link
            to="/settings/security"
            className={`
        Settings__main__aside__subtitle
        ${
          location.pathname === "/settings/security" ? "settings-highlight" : ""
        }`}
          >
            Security and privacy
          </Link>
        </div>
        <div className="Settings__main__aside__section">
          <span className="Settings__main__aside__title">App preferences</span>
          <Link
            to="/settings/appearance"
            className={`
        Settings__main__aside__subtitle
        ${
          location.pathname === "/settings/appearance"
            ? "settings-highlight"
            : ""
        }`}
          >
            App appearance
          </Link>
        </div>
      </div>

      {/* <SecurityPage /> */}
      <Outlet />
    </div>
  );
}

export default SettingsPage;
