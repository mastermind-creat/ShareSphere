import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Message = {
  id: string;
  text: string;
  sender_id: string; // match supabase column
  created_at: string; // Supabase stores as ISO string
};

type ChatMessageProps = {
  message: Message;
  isOwnMessage: boolean;
  senderPhotoURL: string;
  senderUsername: string;
};

export default function ChatMessage({
  message,
  isOwnMessage,
  senderPhotoURL,
  senderUsername
}: ChatMessageProps) {
  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn('flex items-end gap-2', isOwnMessage ? 'justify-end' : '')}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={senderPhotoURL} alt={senderUsername} />
          <AvatarFallback>{senderUsername.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg',
          isOwnMessage
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary'
        )}
      >
        <p className="text-sm">{message.text}</p>
        <p className="text-[10px] mt-1 opacity-70 text-right">{formattedTime}</p>
      </div>
    </div>
  );
}
