'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import ChatMessage from './chat-message';
import ChatInput from './chat-input';
import { ScrollArea } from '@/components/ui/scroll-area';

type ChatUser = {
  id: string;
  username: string;
  photoURL: string;
  status: string;
};

type ChatWindowProps = {
  user: ChatUser;
};

type Message = {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
};

export default function ChatWindow({ user: chatPartner }: ChatWindowProps) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const getChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  };

  useEffect(() => {
    if (!currentUser || !chatPartner) return;

    const chatId = getChatId(currentUser.id, chatPartner.id);

    // Initial fetch
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      if (error) console.error('Error fetching messages:', error);
      else setMessages(data || []);
    };
    fetchMessages();

    // Real-time subscription
    const subscription = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentUser, chatPartner]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        const viewport = scrollAreaRef.current.querySelector(
          'div[data-radix-scroll-area-viewport]'
        );
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }, 100);
    }
  }, [messages]);

  if (!chatPartner) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 p-4 border-b bg-card">
        <Avatar>
          <AvatarImage src={chatPartner.photoURL} alt={chatPartner.username} />
          <AvatarFallback>{chatPartner.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{chatPartner.username}</h2>
          <p className="text-sm text-muted-foreground">{chatPartner.status}</p>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isOwnMessage={msg.sender_id === currentUser?.id}
              senderPhotoURL={msg.sender_id === currentUser?.id ? '' : chatPartner.photoURL}
              senderUsername={msg.sender_id === currentUser?.id ? '' : chatPartner.username}
            />
          ))}
        </div>
      </ScrollArea>
      <ChatInput chatPartnerId={chatPartner.id} />
    </div>
  );
}
