interface PlayIconProps {
  size?: number;
}

export default function PlayIcon({ size = 14 }: PlayIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor">
      <path d="M3 2l7 4-7 4V2z" />
    </svg>
  );
}
