'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import ChatMessage from './chat-message';
import ChatInput from './chat-input';
import { ScrollArea } from '@/components/ui/scroll-area';

type ChatUser = {
  uid: string;
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
  senderId: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

export default function ChatWindow({ user: chatPartner }: ChatWindowProps) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const getChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  };

  useEffect(() => {
    if (currentUser && chatPartner) {
      const chatId = getChatId(currentUser.uid, chatPartner.uid);
      const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('createdAt', 'asc')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs: Message[] = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(msgs);
      });

      return () => unsubscribe();
    }
  }, [currentUser, chatPartner]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // This is a workaround to scroll to the bottom.
        setTimeout(() => {
           if (scrollAreaRef.current) {
               const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
                if (viewport) {
                    viewport.scrollTop = viewport.scrollHeight;
                }
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
              isOwnMessage={msg.senderId === currentUser?.uid}
              senderPhotoURL={msg.senderId === currentUser?.uid ? '' : chatPartner.photoURL}
              senderUsername={msg.senderId === currentUser?.uid ? '' : chatPartner.username}
            />
          ))}
        </div>
      </ScrollArea>
      <ChatInput chatPartnerId={chatPartner.uid} />
    </div>
  );
}
