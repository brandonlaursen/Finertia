import "./SettingsLayout.css";

import { Link, Outlet, useLocation } from "react-router-dom";

function SettingsLayout() {
  const location = useLocation();

  return (
    <div className="SettingsLayout">
      <aside className="SettingsLayout__aside">
        <section className="SettingsLayout__section">
          <span className="SettingsLayout__title">
            Account details and options
          </span>
          <Link
            to="/account/settings/security"
            className={`
       SettingsLayout__subtitle
        ${
          location.pathname === "/account/settings/security" &&
          "settings-highlight-security"
        }`}
          >
            Security and privacy
          </Link>
        </section>
        <section className="SettingsLayout__section">
          <span className="SettingsLayout__title">App preferences</span>
          <Link
            to="/account/settings/appearance"
            className={`
        SettingsLayout__subtitle
        ${
          location.pathname === "/account/settings/appearance" &&
          "settings-highlight-appearance"
        }`}
          >
            App appearance
          </Link>
        </section>
      </aside>

      <Outlet />
    </div>
  );
}

export default SettingsLayout;
