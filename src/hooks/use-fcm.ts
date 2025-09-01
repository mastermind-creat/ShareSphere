'use client';

import { useState, useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { supabase } from '@/lib/supabaseClient';
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
          const messaging = getMessaging();

          // Request permission
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
            });

            if (currentToken) {
              setFcmToken(currentToken);

              // Save token to Supabase
              const { error } = await supabase
                .from('fcm_tokens')
                .upsert({ user_id: user.id, token: currentToken });

              if (error) console.error('Error saving FCM token:', error.message);

              // Handle foreground messages
              onMessage(messaging, (payload) => {
                console.log('Foreground message received:', payload);
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
          console.error('Error retrieving FCM token:', error);
        }
      }
    };

    // Optionally call retrieveToken automatically
    // retrieveToken();
  }, [user, toast]);

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && user) {
      try {
        const messaging = getMessaging();
        const permission = await Notification.requestPermission();
        setNotificationPermissionStatus(permission);

        if (permission === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
          });

          if (currentToken) {
            setFcmToken(currentToken);

            const { error } = await supabase
              .from('fcm_tokens')
              .upsert({ user_id: user.id, token: currentToken });

            if (error) console.error('Error saving FCM token:', error.message);

            toast({ title: 'Success', description: 'Notifications enabled!' });
          }
        } else {
          toast({
            variant: 'destructive',
            title: 'Permission Denied',
            description: 'You will not receive notifications.',
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };

  return { fcmToken, notificationPermissionStatus, requestPermission };
}
