import { Users, Wifi, WifiOff } from 'lucide-react';
import { PresenceAvatar } from './PresenceAvatar';

interface PresenceUser {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

interface PresenceBarProps {
  users: PresenceUser[];
  isConnected: boolean;
  onUserClick?: (userId: string) => void;
}

export function PresenceBar({ users, isConnected, onUserClick }: PresenceBarProps) {
  const activeUsers = users.filter((u) => u.isActive);
  const maxVisible = 5;
  const visibleUsers = activeUsers.slice(0, maxVisible);
  const remainingCount = activeUsers.length - maxVisible;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-alecia-silver/20">
      <div className="flex items-center gap-2">
        {isConnected ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-alecia-red" />
        )}
        <span className="text-sm text-alecia-navy flex items-center gap-1">
          <Users className="w-4 h-4" />
          {activeUsers.length}
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center -space-x-2">
        {visibleUsers.map((user) => (
          <PresenceAvatar
            key={user.id}
            user={user}
            onClick={() => onUserClick?.(user.id)}
          />
        ))}
        
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-alecia-silver/20 border-2 border-white flex items-center justify-center">
            <span className="text-xs text-alecia-navy font-medium">
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
