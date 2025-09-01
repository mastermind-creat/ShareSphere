'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/header';
import ChatLayout from '@/components/chat/chat-layout';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

type ChatUser = {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string | null;
};

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);

      const { data, error } = await supabase
        .from('users')
        .select('id, username, avatar_url, status')
        .neq('id', user.id);

      if (error) {
        console.error('Error fetching users:', error.message);
        setUsers([]);
      } else if (data) {
        setUsers(data as ChatUser[]);
        if (!selectedUser && data.length > 0) {
          setSelectedUser(data[0]);
        }
      }

      setLoadingUsers(false);
    };

    fetchUsers();

    // ✅ Supabase Realtime subscription
    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        () => {
          fetchUsers(); // refresh on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <Skeleton className="h-[calc(100vh-150px)] w-full" />
        </main>
      </div>
    );
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
