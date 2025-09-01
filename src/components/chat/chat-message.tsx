import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
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
      </div>
    </div>
  );
}
