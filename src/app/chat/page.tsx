'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/header';
import ChatLayout from '@/components/chat/chat-layout';
import { collection, onSnapshot, query, where, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

type ChatUser = {
  uid: string;
  username: string;
  photoURL: string;
  status: string;
};

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'users'), where('__name__', '!=', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const usersData: ChatUser[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as DocumentData;
          usersData.push({
            uid: doc.id,
            username: data.username,
            photoURL: data.photoURL,
            status: data.status
          });
        });
        setUsers(usersData);
        if (usersData.length > 0 && !selectedUser) {
            setSelectedUser(usersData[0]);
        }
        setLoadingUsers(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
           <Skeleton className="h-[calc(100vh-150px)] w-full" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <ChatLayout 
          users={users}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          loadingUsers={loadingUsers}
        />
      </main>
    </div>
  );
}
