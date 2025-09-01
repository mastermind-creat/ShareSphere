import { ChatUser } from './chat-layout';

type ChatWindowProps = {
  user: ChatUser;
};

export default function ChatWindow({ user }: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-3 p-4 border-b">
        <img
          src={user.avatar_url || '/default-avatar.png'}
          alt={user.username}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{user.username}</p>
          <p className="text-xs text-gray-500">{user.status || 'Offline'}</p>
        </div>
      </header>

      {/* Chat messages go here */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-gray-500">
          This is the beginning of your conversation with {user.username}.
        </p>
      </div>

      {/* Message input */}
      <footer className="p-4 border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-400"
        />
      </footer>
    </div>
  );
}
