interface EyeSlashIconProps {
  className?: string;
  strokeWidth?: number;
}

export function EyeSlashIcon({ className = 'h-4 w-4', strokeWidth = 2 }: EyeSlashIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M3 3l18 18" />
    </svg>
  );
}
