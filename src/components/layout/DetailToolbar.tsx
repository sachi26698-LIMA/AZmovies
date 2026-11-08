import type { RefObject } from 'react';
import { ClapperIcon, MenuIcon } from '@/components/Icons';
import styles from '@/styles/detail.module.css';

interface DetailToolbarProps {
  onOpenMenu: () => void;
  menuExpanded: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function DetailToolbar({ onOpenMenu, menuExpanded, inputRef }: DetailToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        className={styles.toolbarMenu}
        aria-label="Open navigation"
        aria-expanded={menuExpanded}
        aria-controls="side-drawer"
        onClick={onOpenMenu}
      >
        <MenuIcon />
      </button>
      <button type="button" className={styles.toolbarFourK} aria-disabled="true">
        <ClapperIcon size={16} className={styles.inlineIcon} /> 4K Movies
      </button>
      <form className={styles.toolbarSearch} role="search" action="/" method="get">
        <label className="visually-hidden" htmlFor="detail-search">
          Search here
        </label>
        <input
          id="detail-search"
          ref={inputRef}
          className={styles.toolbarSearchInput}
          type="search"
          name="q"
          placeholder="Search here..."
          maxLength={80}
        />
        <button type="submit" className="visually-hidden">
          Search
        </button>
      </form>
    </div>
  );
}
