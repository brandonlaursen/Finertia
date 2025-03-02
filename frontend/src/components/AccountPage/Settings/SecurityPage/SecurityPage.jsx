import "./SecurityPage.css";
import { MdRemoveRedEye } from "react-icons/md";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import NotificationPopUp from "../../../NotificationPopUp/NotificationPopUp";

import { logout, editPassword } from "../../../../../store/session";

function SecurityPage() {
  const dispatch = useDispatch();

  const [showPasswordEdit, setShowPasswordEdit] = useState(false);

  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPasswordErrors, setCurrentPasswordErrors] = useState("");
  const [newPasswordErrors, setNewPasswordErrors] = useState("");
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState("");

  const [notifications, setNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");



  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);

    if (!isDirty) setIsDirty(true);

 
    if (
      currentPassword.length === 0 ||
      newPassword.length === 0 ||
      confirmPassword.length === 0
    )
      return;
    if (newPassword !== confirmPassword) return;

    const data = await dispatch(editPassword({ currentPassword, newPassword }));

    if (data.errorMessage) {
      setCurrentPasswordErrors(data.errorMessage);
      return;
    }

    setShowPasswordEdit(false);
    setNotificationMessage(data.message);
    setNotifications(true);
    setIsDirty(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPasswordErrors("");
    setShowCurrentPassword("");
    setConfirmPasswordErrors("");

    await new Promise((resolve) => {
      setTimeout(() => {
        setNotifications(false);
        resolve();
      }, 5000);
    });
  };

  const handleCancel = async () => {
    setShowPasswordEdit(false);
    setIsDirty(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPasswordErrors("");
    setShowCurrentPassword("");
    setConfirmPasswordErrors("");
  };

  useEffect(() => {
    if (!isDirty) return;

    if (currentPassword.length === 0) {
      setCurrentPasswordErrors("This field is required");
    }
    if (newPassword.length <= 3) {
      setNewPasswordErrors("Password required is a minimum of 3 characters");
    }
    if (confirmPassword.length <= 3) {
      setConfirmPasswordErrors(
        "Password required is a minimum of 3 characters"
      );
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordErrors("Passwords do not match");
    }
  }, [
    currentPassword,
    confirmPassword,
    newPassword,
    setCurrentPasswordErrors,
    setNewPasswordErrors,
    setConfirmPasswordErrors,
    isDirty,
  ]);

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
          <div
            className={`SecurityPage__link-password ${
              showPasswordEdit && "SecurityPage_border-password"
            }`}
          >
            <div
              className={`SecurityPage__link ${
                showPasswordEdit
                  ? "SecurityPage_border-link"
                  : "border-top-bottom"
              }`}
              onClick={() => setShowPasswordEdit(!showPasswordEdit)}
            >
              <span>Password</span>
              {!showPasswordEdit && <span>Update Password</span>}
            </div>
            {showPasswordEdit && (
              <div className="SecurityPage__editContainer">
                <div className="SecurityPage_section">
                  <div className="SecurityPage_input-container">
                    <label className="SecurityPage_input-label">
                      Current Password
                    </label>

                    <input
                      required
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value),
                          setCurrentPasswordErrors(false);
                      }}
                      className={`SecurityPage_input-field ${
                        currentPasswordErrors && "error-border"
                      }`}
                    />
                    <MdRemoveRedEye
                      className="SecurityPage__hide-icon"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    />
                  </div>
                  {currentPasswordErrors && (
                    <span className="SecurityPage-errors">
                      {currentPasswordErrors}
                    </span>
                  )}
                </div>

                <div className="SecurityPage_section">
                  <div className="SecurityPage_input-container">
                    <label className="SecurityPage_input-label">
                      New Password
                    </label>
                    <input
                      required
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value),
                          setNewPasswordErrors(false);
                      }}
                      className={`SecurityPage_input-field ${
                        newPasswordErrors && "error-border"
                      }`}
                    />
                    <MdRemoveRedEye
                      className="SecurityPage__hide-icon"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  </div>
                  {newPasswordErrors && (
                    <span className="SecurityPage-errors">
                      {newPasswordErrors}
                    </span>
                  )}
                </div>

                <div className="SecurityPage_section">
                  <div className="SecurityPage_input-container">
                    <label className="SecurityPage_input-label">
                      Confirm New Password
                    </label>
                    <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value),
                          setConfirmPasswordErrors(false);
                      }}
                      className={`SecurityPage_input-field ${
                        confirmPasswordErrors && "error-border"
                      }`}
                    />
                    <MdRemoveRedEye
                      className="SecurityPage__hide-icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  </div>
                  {confirmPasswordErrors && (
                    <span className="SecurityPage-errors">
                      {confirmPasswordErrors}
                    </span>
                  )}
                </div>

                <div className="SecurityPage_button-container">
                  <button
                    onClick={handleCancel}
                    className="SecurityPage_cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="SecurityPage_save-button"
                    disabled={
                      confirmPasswordErrors.length ||
                      currentPasswordErrors.length ||
                      confirmPasswordErrors.length
                    }
                  >
                    {isLoading ? (
                      <span className="StockTransaction__spinner"></span>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

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
