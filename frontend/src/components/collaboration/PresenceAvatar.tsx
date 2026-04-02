interface PresenceUser {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

interface PresenceAvatarProps {
  user: PresenceUser;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function PresenceAvatar({ user, onClick, size = 'md' }: PresenceAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative group cursor-pointer
        ${sizeClasses[size]}
      `}
    >
      <div
        className={`
          w-full h-full rounded-full border-2 border-white
          flex items-center justify-center
          transition-transform hover:scale-110
          ${user.isActive ? '' : 'opacity-50 grayscale'}
        `}
        style={{ backgroundColor: user.color }}
      >
        <span className="text-white font-medium">
          {getInitials(user.name)}
        </span>
      </div>

      {user.isActive && (
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
      )}

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-alecia-navy text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {user.name}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-alecia-navy" />
      </div>
    </div>
  );
}
