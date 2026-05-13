interface ArrowProps {
  size?: number;
}

export default function Arrow({ size = 12 }: ArrowProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      className="inline-block transition-transform duration-250 ease-in-out"
    >
      <path
        d="M1 6h10M7 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}
