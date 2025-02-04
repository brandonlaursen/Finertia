import "./SecurityPage.css";

import { useDispatch } from "react-redux";
import { logout } from "../../../../../store/session";

function SecurityPage() {
 
  const dispatch = useDispatch();

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

        <div className="SecurityPage__content__links">
          <div className="SecurityPage__link">
            <span>Password</span>
            <span>Update Password</span>
          </div>
          <div className="SecurityPage__link">
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
      </div>

      <div className="SecurityPage__content">
        <span className="SecurityPage__content__title">Privacy</span>
        <span className="SecurityPage__content__subtitle">
          Manage how your data is used..
        </span>

        <div className="SecurityPage__content__links">
          <div className="SecurityPage__link">
            <span>Profile Visibility</span>
          </div>
          <div className="SecurityPage__link">
            <span>Data Sharing Permissions</span>
            <span>Enabled</span>
          </div>
          <div className="SecurityPage__link">
            <span>Request Personal Data</span>
          </div>
          <div className="SecurityPage__link">
            <span>Request Data Deletion</span>
          </div>
          <div className="SecurityPage__link">
            <span>Private Privacy</span>
          </div>
        </div>
      </div>

      <div className="SecurityPage__logout">
        <span className="SecurityPage__logout-span" onClick={handleLogout}>
          Log out
        </span>
      </div>
    </div>
  );
}

export default SecurityPage;
