import { TelegramIcon } from '@/components/Icons';
import styles from '@/styles/prototype.module.css';

interface TelegramFloatingProps {
  href?: string | null;
}

export function TelegramFloating({ href = null }: TelegramFloatingProps) {
  if (href) {
    return (
      <a
        className={styles.telegram}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join AZmovies on Telegram (opens in a new tab)"
      >
        <TelegramIcon />
      </a>
    );
  }

  return (
    <button
      type="button"
      className={styles.telegram}
      aria-disabled="true"
      aria-label="Telegram link not configured in this prototype"
      title="Telegram link not configured in this prototype"
    >
      <TelegramIcon />
    </button>
  );
}
