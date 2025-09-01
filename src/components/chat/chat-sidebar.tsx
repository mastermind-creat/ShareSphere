import { ChatUser } from './chat-layout';

type ChatSidebarProps = {
  users: ChatUser[];
  selectedUser: ChatUser | null;
  onSelectUser: (user: ChatUser) => void;
  loadingUsers: boolean;
};

export default function ChatSidebar({
  users,
  selectedUser,
  onSelectUser,
  loadingUsers,
}: ChatSidebarProps) {
  if (loadingUsers) {
    return <div className="p-4 text-sm text-gray-500">Loading users…</div>;
  }

  return (
    <div className="overflow-y-auto h-full">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user)}
          className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 ${
            selectedUser?.id === user.id ? 'bg-gray-200 font-semibold' : ''
          }`}
        >
          <img
            src={user.avatar_url || '/default-avatar.png'}
            alt={user.username}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm">{user.username}</p>
            <p className="text-xs text-gray-500">{user.status || 'Offline'}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
