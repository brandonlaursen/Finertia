import "./SecurityPage.css";

import { useState } from "react";
import { useDispatch } from "react-redux";

import NotificationPopUp from "../../components/NotificationPopUp";
import AppearancePage from "../AppearancePage/AppearancePage";

import { logout } from "../../../store/session";

import UpdatePassword from "./UpdatePassword";

function SecurityPage() {
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleLogout = async (e) => {
    e.stopPropagation();
    await dispatch(logout());
  };

  return (
    <div className="SecurityPage">
      <section className="SecurityPage__section">
        <div className="SecurityPage__appearance-page-wrapper">
          <AppearancePage />
        </div>

        <span className="SecurityPage__title">Security</span>
        <span className="SecurityPage__subtitle">
          Keep your Finertia account secure.
        </span>

        <div className="SecurityPage__links">
          <UpdatePassword
            setNotificationMessage={setNotificationMessage}
            setNotifications={setNotifications}
          />

          <div className="SecurityPage__link ">
            <span>Two Factor Authentication</span>
            <span>Disabled</span>
          </div>
          <div className="SecurityPage__link">
            <span>Devices</span>
          </div>
          <div className="SecurityPage__link">
            <span>Linked Apps</span>
          </div>
        </div>
      </section>

      <section className="SecurityPage__section">
        <span className="SecurityPage__title">Privacy</span>
        <span className="SecurityPage__subtitle">
          Manage how your data is used..
        </span>

        <div className="SecurityPage__links">
          <div className="SecurityPage__link SecurityPage__border-top">
            <span>Profile Visibility</span>
          </div>
          <div className="SecurityPage__link">
            <span>Data Sharing Permissions</span>
            <span>Enabled</span>
          </div>

          <div className="SecurityPage__link">
            <span>Private Privacy</span>
          </div>
        </div>
      </section>

      <section className="SecurityPage__logout">
        <span className="SecurityPage__logout-span" onClick={handleLogout}>
          Log out
        </span>
      </section>

      {notifications && (
        <div className="NotificationPopsContainer">
          <NotificationPopUp
            message={notificationMessage}
            setNotifications={setNotifications}
          />
        </div>
      )}
    </div>
  );
}

export default SecurityPage;
