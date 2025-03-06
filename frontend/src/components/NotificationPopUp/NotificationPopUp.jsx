import "./NotificationPopUp.css";
import { GrFormCheckmark } from "react-icons/gr";
import CloseButton from "../CloseButton/CloseButton";

function NotificationPopUp({ message, setNotifications }) {
  return (
    <div className="NotificationPopUp">
      <span className="notification-message">
        <GrFormCheckmark className="NotificationPopUp-checkmark" />
        {message}
      </span>
      <span className="NotificationPopUp-view">
        <CloseButton clearNotifications={() => setNotifications(false)} />
      </span>
    </div>
  );
}

export default NotificationPopUp;
