import "./AccountLayout.css";

import { Outlet, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectUser } from "../../../store/session";

function AccountLayout() {
  const location = useLocation();
  const sessionUser = useSelector(selectUser);

  const navLinks = [
    { path: "/account/investing", label: "Investing" },
    { path: "/account/transfers", label: "Transfers" },
    { path: "/account/history", label: "History" },
    { path: "/account/settings/security", label: "Settings" },
    { path: "/account/help", label: "Help" },
  ];

  const isActive = (path) =>
    path === "/account/settings/security"
      ? location.pathname.includes("settings")
      : location.pathname === path;

  return (
    <div className="AccountLayout">
      <main className="AccountLayout__main">
        <div className="AccountLayout__container">
          <header className="AccountLayout__username">
            {sessionUser.firstName} {sessionUser.lastName}
          </header>

          <section className="AccountLayout__section">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`AccountLayout__select ${
                  isActive(path) ? "AccountLayout__selected" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </section>
        </div>
      </main>

      <Outlet />
    </div>
  );
}

export default AccountLayout;
