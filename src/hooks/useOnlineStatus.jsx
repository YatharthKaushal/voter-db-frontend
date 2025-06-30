// src/hooks/useOnlineStatus.js
import { useState, useEffect } from "react";

const useOnlineStatus = () => {
  // Initialize state with the current online status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Function to update the online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Add event listeners for 'online' and 'offline' events
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Initial check on mount (important for when the component mounts after the initial load)
    updateOnlineStatus();

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount and unmount

  return isOnline;
};

export default useOnlineStatus;
