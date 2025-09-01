'use client';

import { useState, useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export function useFCM() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermissionStatus(Notification.permission);
    }
  }, []);

  useEffect(() => {
    const retrieveToken = async () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && user) {
        try {
          const messaging = getMessaging(app);
          
          // Request permission
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (permission === 'granted') {
            const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY });
            if (currentToken) {
              setFcmToken(currentToken);
              // Save the token to Firestore
              await setDoc(doc(db, 'fcmTokens', user.uid), { token: currentToken }, { merge: true });

              // Handle foreground messages
              onMessage(messaging, (payload) => {
                console.log('Foreground message received.', payload);
                toast({
                  title: payload.notification?.title,
                  description: payload.notification?.body,
                });
              });
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          } else {
            console.log('Notification permission denied.');
          }
        } catch (error) {
          console.error('An error occurred while retrieving token. ', error);
        }
      }
    };

    if (user && notificationPermissionStatus === 'default') {
        // We only request token if permission is not yet granted or denied.
        // Let's prompt the user implicitly by showing a toast or a button.
    }

    // This is an example of how you might call it.
    // In a real app, you would trigger this based on user action.
    // retrieveToken();

  }, [user, notificationPermissionStatus, toast]);

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && user) {
        try {
            const messaging = getMessaging(app);
            const permission = await Notification.requestPermission();
            setNotificationPermissionStatus(permission);
             if (permission === 'granted') {
                const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY });
                if (currentToken) {
                    setFcmToken(currentToken);
                    await setDoc(doc(db, 'fcmTokens', user.uid), { token: currentToken }, { merge: true });
                    toast({ title: 'Success', description: 'Notifications enabled!' });
                }
             } else {
                toast({ variant: 'destructive', title: 'Permission Denied', description: 'You will not receive notifications.' });
             }
        } catch (error) {
            console.error('Error requesting permission', error);
        }
    }
  };

  return { fcmToken, notificationPermissionStatus, requestPermission };
}
