import Link from 'next/link';
import { MenuIcon, SearchIcon } from '@/components/Icons';
import styles from '@/styles/prototype.module.css';

interface HeaderProps {
  onOpenMenu?: () => void;
  onSearchClick?: () => void;
  menuExpanded?: boolean;
  menuControls?: string;
}

export function Header({
  onOpenMenu,
  onSearchClick,
  menuExpanded = false,
  menuControls = 'side-drawer',
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <button
          type="button"
          className={styles.headerIconButton}
          aria-label="Open navigation"
          aria-expanded={menuExpanded}
          aria-controls={menuControls}
          onClick={onOpenMenu}
        >
          <MenuIcon />
        </button>
        <Link className={styles.brand} href="/" aria-label="AZmovies home">
          AZmovies
        </Link>
        <button
          type="button"
          className={styles.headerSearchButton}
          aria-label="Focus search"
          onClick={onSearchClick}
        >
          <SearchIcon />
        </button>
      </div>
    </header>
  );
}
