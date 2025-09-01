'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Mic, SendHorizonal, Smile } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type ChatInputProps = {
  chatPartnerId: string;
};

export default function ChatInput({ chatPartnerId }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const getChatId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    const chatId = getChatId(user.id, chatPartnerId);

    try {
      const { error } = await supabase.from('messages').insert([
        {
          chat_id: chatId,
          sender_id: user.id,
          text: message,
          read: false,
        },
      ]);

      if (error) throw error;

      setMessage('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not send message.',
      });
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t bg-card">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon">
          <Paperclip />
        </Button>
        <Button type="button" variant="ghost" size="icon">
          <Smile />
        </Button>
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="button" variant="ghost" size="icon">
          <Mic />
        </Button>
        <Button type="submit" size="icon">
          <SendHorizonal />
        </Button>
      </div>
    </form>
  );
}
