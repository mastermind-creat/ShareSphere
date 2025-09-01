import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { Search } from 'lucide-react';

type ChatUser = {
  uid: string;
  username: string;
  photoURL: string;
  status: string;
};

type ChatSidebarProps = {
  users: ChatUser[];
  selectedUser: ChatUser | null;
  onSelectUser: (user: ChatUser) => void;
  loading: boolean;
};

export default function ChatSidebar({ users, selectedUser, onSelectUser, loading }: ChatSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chats</h2>
        <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-8" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {loading ? (
            <div className="p-4 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        ) : users.length > 0 ? (
            users.map((user) => (
            <div
                key={user.uid}
                className={cn(
                'flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary',
                selectedUser?.uid === user.uid ? 'bg-secondary' : ''
                )}
                onClick={() => onSelectUser(user)}
            >
                <Avatar>
                <AvatarImage src={user.photoURL} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-muted-foreground truncate">{user.status}</p>
                </div>
            </div>
            ))
        ) : (
            <div className="p-4 text-center text-muted-foreground">
                No users found.
            </div>
        )}
      </ScrollArea>
    </div>
  );
}
