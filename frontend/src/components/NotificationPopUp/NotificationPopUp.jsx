import "./NotificationPopUp.css";
import { IoClose } from "react-icons/io5";

function NotificationPopUp({ message, setNotifications }) {
  return (
    <div className="NotificationPopUp">
      <span>{message}</span>
      <span className="NotificationPopUp-view">
        <button className="NotificationPopUp-close-button">
          <IoClose
            className="NotificationPopUp-close-icon"
            onClick={() => setNotifications(false)}
          />
        </button>
      </span>
    </div>
  );
}

export default NotificationPopUp;
