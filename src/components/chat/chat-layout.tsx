import ChatSidebar from './chat-sidebar';
import ChatWindow from './chat-window';

type ChatUser = {
  uid: string;
  username: string;
  photoURL: string;
  status: string;
};

type ChatLayoutProps = {
  users: ChatUser[];
  selectedUser: ChatUser | null;
  onSelectUser: (user: ChatUser) => void;
  loadingUsers: boolean;
};

export default function ChatLayout({ users, selectedUser, onSelectUser, loadingUsers }: ChatLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-220px)] border rounded-lg">
      <div className="md:col-span-1 lg:col-span-1 border-r">
        <ChatSidebar 
            users={users} 
            selectedUser={selectedUser} 
            onSelectUser={onSelectUser}
            loading={loadingUsers}
        />
      </div>
      <div className="md:col-span-2 lg:col-span-3 h-full flex flex-col">
        {selectedUser ? (
          <ChatWindow user={selectedUser} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
