'use client';

import { useEffect } from 'react';
import { useFCM } from '@/hooks/use-fcm';
import { Button } from './ui/button';
import { BellRing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FcmHandler() {
  const { notificationPermissionStatus, requestPermission } = useFCM();
  const { toast } = useToast();

  useEffect(() => {
    if (notificationPermissionStatus === 'default') {
        // You could use a less intrusive UI element to prompt for permission
    }
  }, [notificationPermissionStatus, toast]);

  if (notificationPermissionStatus === 'granted') {
    return null; // Already have permission
  }

  if (notificationPermissionStatus === 'denied') {
    return (
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md my-4">
            <p className="font-bold">Notifications Blocked</p>
            <p>You have blocked notifications. To enable them, please update your browser settings.</p>
        </div>
    );
  }

  return (
    <div className="p-4 bg-secondary border rounded-lg my-4 flex items-center justify-between">
      <div>
        <h3 className="font-semibold">Enable Notifications</h3>
        <p className="text-sm text-muted-foreground">Stay updated with chat messages and file alerts.</p>
      </div>
      <Button onClick={requestPermission}>
        <BellRing className="mr-2 h-4 w-4" />
        Enable Notifications
      </Button>
    </div>
  );
}
