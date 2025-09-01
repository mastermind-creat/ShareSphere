'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import ChatLayout, { ChatUser } from '@/components/chat/chat-layout';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatPageContent() {
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
        // Map DB columns directly into ChatUser
        const mappedUsers: ChatUser[] = data.map((u: any) => ({
          id: u.id,
          username: u.username,
          avatar_url: u.avatar_url || null,
          status: u.status || null,
        }));

        setUsers(mappedUsers);

        if (!selectedUser && mappedUsers.length > 0) {
          setSelectedUser(mappedUsers[0]);
        }
      }

      setLoadingUsers(false);
    };

    fetchUsers();

    // Real-time updates using Supabase
    const channel = supabase
      .channel('public_users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users', filter: `id=neq.${user.id}` },
        () => fetchUsers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (authLoading) {
    return <Skeleton className="h-[calc(100vh-220px)] w-full" />;
  }

  return (
    <ChatLayout
      users={users}
      selectedUser={selectedUser}
      onSelectUser={(user) => setSelectedUser(user)}
      loadingUsers={loadingUsers}
    />
  );
}
