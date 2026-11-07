import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function MenuIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function SearchIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m15.5 15.5 5 5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function CloseIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function TelegramIcon({ size = 30, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M21.5 3.5 2.8 10.7c-1 .4-1 1.8.1 2.1l4.7 1.5 1.8 5.6c.3.9 1.4 1.1 2 .4l2.6-2.8 4.8 3.5c.8.6 1.9.1 2.1-.9l3-15.2c.2-1.1-.9-1.9-2.4-1.4Z"
        fill="currentColor"
      />
      <path d="m7.6 14.3 10.9-7-8.7 8.2-.4 3.1-1.8-4.3Z" fill="rgba(0,0,0,.18)" />
    </svg>
  );
}

export function ClapperIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3 9h18v11H3z" fill="currentColor" />
      <path d="m3 9 2-5h16l-2 5" fill="currentColor" />
      <path d="m7 4-2 5m7-5-2 5m7-5-2 5" stroke="#000" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

export function CalendarIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M4 6h16v15H4z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M4 10h16M8 3v5m8-5v5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function FolderIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3 6h7l2 2h9v12H3z" fill="currentColor" />
    </svg>
  );
}

export function HomeIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="m3 11 9-8 9 8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M6 10v11h12V10" fill="currentColor" />
    </svg>
  );
}

export function PlayIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
    </svg>
  );
}
