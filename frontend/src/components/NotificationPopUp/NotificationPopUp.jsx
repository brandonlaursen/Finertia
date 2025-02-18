import "./NotificationPopUp.css";
import { IoClose } from "react-icons/io5";


function NotificationPopUp({message, setNotifications}) {

  return (
    <div className="NotificationPopUp">
      <span>{message}</span>
      <span className='NotificationPopUp-view'>
        View <IoClose className='NotificationPopUp-icon'
        onClick={() => setNotifications(false)}/>
      </span>
    </div>
  );
}

export default NotificationPopUp;
