import { useState, useRef } from "react";

import NotificationPopUp from "../NotificationPopUp/NotificationPopUp";

// Notification Manager Component
function NotificationManager({setNotifications, removeNotification, notificationMessage}) {
  // const [notifications, setNotifications] = useState([]);
  // const timeoutRefs = useRef([]); // Ref to track timeouts

  // // Function to add a notification
  // function addNotification(message) {
  //   const newNotification = {
  //     id: Date.now(), // Unique ID for each notification
  //     message,
  //   };

  //   // Add the new notification to the array
  //   setNotifications((prev) => [...prev, newNotification]);

  //   // Set timeout to remove notification after 5 seconds
  //   const timeoutId = setTimeout(() => {
  //     removeNotification(newNotification.id);
  //   }, 5000);

  //   // Keep track of this timeout so we can clear it later if needed
  //   timeoutRefs.current.push({ id: newNotification.id, timeoutId });
  // }

  // Function to remove a notification by ID
  // function removeNotification(id) {
  //   // Clear the timeout for the notification
  //   const timeoutToClear = timeoutRefs.current.find((ref) => ref.id === id);
  //   if (timeoutToClear) {
  //     clearTimeout(timeoutToClear.timeoutId);
  //   }

  //   // Remove notification from the state
  //   setNotifications((prev) => prev.filter((notification) => notification.id !== id));

  //   // Remove from the refs array to avoid memory leaks
  //   timeoutRefs.current = timeoutRefs.current.filter((ref) => ref.id !== id);
  // }

  return (
    <div>
      {/* <button onClick={() => addNotification("New notification!")}>
        Show Notification
      </button> */}

      <div className="NotificationsContainer">
        {notificationMessage.map((notification) => (
          <NotificationPopUp
            key={notification.id}
            id={notification.id}
            message={notification.message}
            setNotifications={setNotifications}
            removeNotification={removeNotification}
          />
        ))}
      </div>
    </div>
  );
}

export default NotificationManager;
