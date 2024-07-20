import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { requestForToken, onMessageListener } from '../firebase/firebase';

const Notification = () => {
  const [notification, setNotification] = useState({ title: '', body: '' });
  const notify = () => toast(<ToastDisplay />);

  function ToastDisplay() {
    return (
      <div>
        <p><b>{notification?.title}</b></p>
        <p>{notification?.body}</p>
      </div>
    );
  }

  useEffect(() => {
    if (notification?.title) {
      notify();
    }
  }, [notification]);

  useEffect(() => {
    // Ensure we are in a browser environment
    if (typeof window !== 'undefined' && 'Notification' in window) {
      // Access Notification from window object to avoid conflicts
      const NotificationInstance = window.Notification;
  
      // Check for permission
      if (NotificationInstance.permission === 'granted') {
        requestForToken();
      } else if (NotificationInstance.permission !== 'denied') {
        // Request permission
        NotificationInstance.requestPermission().then((permission) => {
          if (permission === 'granted') {
            requestForToken();
          }
        }).catch((error) => {
          console.error('Error requesting notification permission:', error);
        });
      }
    } else {
      console.error('Notifications are not supported in this environment.');
    }
  }, []);
  

  onMessageListener()
    .then((payload) => {
      setNotification({ title: payload?.notification?.title, body: payload?.notification?.body });
    })
    .catch((err) => console.log('failed: ', err));

  return (
    <Toaster />
  );
};

export default Notification;
