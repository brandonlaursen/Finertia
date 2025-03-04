import "./UpdatePassword.css";
import { MdRemoveRedEye } from "react-icons/md";


import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { editPassword } from "../../../../store/session";

function UpdatePassword({ setNotificationMessage, setNotifications }) {
  const dispatch = useDispatch();
  const [isDirty, setIsDirty] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordErrors, setCurrentPasswordErrors] = useState("");
  const [newPasswordErrors, setNewPasswordErrors] = useState("");
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setNewPasswordErrors("");
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

  return (
    <div
      className={`UpdatePassword ${
        showPasswordEdit && "UpdatePassword--active"
      }`}
    >
      <div
        className={`UpdatePassword__button ${
          !showPasswordEdit && "UpdatePassword--not-active"
        }`}
        onClick={() => setShowPasswordEdit(!showPasswordEdit)}
      >
        <span>Password</span>
        {!showPasswordEdit && <span>Update Password</span>}
      </div>

      {showPasswordEdit && (
        <div className="UpdatePassword__edit-container">
          <section className="UpdatePassword__section">
            <div className="UpdatePassword__input-container">
              <label className="UpdatePassword__input-label">
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
                className={`UpdatePassword__input-field ${
                  currentPasswordErrors && "UpdatePassword__errors--border"
                }`}
              />
              <MdRemoveRedEye
                className="UpdatePassword__hide-icon"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            </div>
            {currentPasswordErrors && (
              <span className="UpdatePassword__errors">
                {currentPasswordErrors}
              </span>
            )}
          </section>

          <section className="UpdatePassword__section">
            <div className="UpdatePassword__input-container">
              <label className="UpdatePassword__input-label">
                New Password
              </label>
              <input
                required
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value), setNewPasswordErrors(false);
                }}
                className={`UpdatePassword__input-field ${
                  newPasswordErrors && "UpdatePassword__errors--border"
                }`}
              />
              <MdRemoveRedEye
                className="UpdatePassword__hide-icon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            </div>
            {newPasswordErrors && (
              <span className="UpdatePassword__errors">
                {newPasswordErrors}
              </span>
            )}
          </section>

          <section className="UpdatePassword__section">
            <div className="UpdatePassword__input-container">
              <label className="UpdatePassword__input-label">
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
                className={`UpdatePassword__input-field ${
                  confirmPasswordErrors && "UpdatePassword__errors--border"
                }`}
              />
              <MdRemoveRedEye
                className="UpdatePassword__hide-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            {confirmPasswordErrors && (
              <span className="UpdatePassword__errors">
                {confirmPasswordErrors}
              </span>
            )}
          </section>

          <section className="UpdatePassword__button-container">
            <button
              onClick={handleCancel}
              className="UpdatePassword__cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="UpdatePassword__save-button"
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
          </section>
        </div>
      )}
    </div>
  );
}

export default UpdatePassword;
