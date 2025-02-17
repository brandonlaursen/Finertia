import "./NotificationPopUp.css";
import { IoClose } from "react-icons/io5";

function NotificationPopUp() {
  return (
    <div className="NotificationPopUp">
      <span>Notification message</span>
      <span className='NotificationPopUp-view'>
        View <IoClose className='NotificationPopUp-icon'/>
      </span>
    </div>
  );
}

export default NotificationPopUp;
