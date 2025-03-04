import "./SecurityPage.css";

import { useState } from "react";
import { useDispatch } from "react-redux";

import NotificationPopUp from "../../components/NotificationPopUp";

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
      <div className="SecurityPage__content">
        <span className="SecurityPage__content__title">Security</span>
        <span className="SecurityPage__content__subtitle">
          Keep your Finertia account secure with additional layers of
          protection.
        </span>

        <div className={`SecurityPage__content__links `}>
          <UpdatePassword
            setNotificationMessage={setNotificationMessage}
            setNotifications={setNotifications}
          />

          <div className="SecurityPage__link ">
            <span>Two Factor Authentication</span>
            <span>Disabled</span>
          </div>
          <div className="SecurityPage__link SecurityPage_border">
            <span>Devices</span>
          </div>
          <div className="SecurityPage__link SecurityPage_border border-bottom">
            <span>Linked Apps</span>
          </div>
        </div>
      </div>

      <div className="SecurityPage__content">
        <span className="SecurityPage__content__title">Privacy</span>
        <span className="SecurityPage__content__subtitle">
          Manage how your data is used..
        </span>

        <div className="SecurityPage__content__links">
          <div className="SecurityPage__link SecurityPage_border">
            <span>Profile Visibility</span>
          </div>
          <div className="SecurityPage__link SecurityPage_border">
            <span>Data Sharing Permissions</span>
            <span>Enabled</span>
          </div>

          <div className="SecurityPage__link SecurityPage_border border-bottom">
            <span>Private Privacy</span>
          </div>
        </div>
      </div>

      <div className="SecurityPage__logout">
        <span className="SecurityPage__logout-span" onClick={handleLogout}>
          Log out
        </span>
      </div>
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
