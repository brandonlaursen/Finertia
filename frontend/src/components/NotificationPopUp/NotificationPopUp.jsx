import "./NotificationPopUp.css";
import { IoClose } from "react-icons/io5";

function NotificationPopUp({ message, setNotifications }) {
  return (
    <div className="NotificationPopUp">
      <span>{message}asdf</span>
      <span className="NotificationPopUp-view">
        <IoClose
          className="NotificationPopUp-icon"
          onClick={() => setNotifications(false)}
        />
      </span>
    </div>
  );
}

export default NotificationPopUp;
