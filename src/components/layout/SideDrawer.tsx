'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { DRAWER_LINKS } from '@/lib/fixtures';
import { CloseIcon } from '@/components/Icons';
import styles from '@/styles/prototype.module.css';

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (label: string) => void;
  onSearch: (query: string) => void;
}

export function SideDrawer({ open, onClose, onNavigate, onSearch }: SideDrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    searchRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(query);
    onClose();
  }

  return (
    <div className={styles.drawerLayer}>
      <button
        type="button"
        className={styles.drawerOverlay}
        aria-label="Close navigation"
        onClick={onClose}
      />
      <div
        id="side-drawer"
        ref={dialogRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <button type="button" className="visually-hidden" onClick={onClose}>
          <CloseIcon /> Close navigation
        </button>
        <form className={styles.drawerSearchForm} role="search" onSubmit={handleSearch}>
          <label className="visually-hidden" htmlFor="drawer-search">
            Search here
          </label>
          <input
            id="drawer-search"
            ref={searchRef}
            className={styles.drawerSearchInput}
            type="search"
            placeholder="Search here..."
            maxLength={80}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="visually-hidden">
            Search
          </button>
        </form>
        <nav aria-label="Drawer categories">
          <ul className={styles.drawerList}>
            {DRAWER_LINKS.map((label) => (
              <li key={label}>
                {label === 'AZmovies Home' ? (
                  <Link className={styles.drawerLink} href="/" onClick={onClose}>
                    {label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={styles.drawerLink}
                    onClick={() => {
                      onNavigate(label);
                      onClose();
                    }}
                  >
                    {label}
                    {label === 'GENREs' || label === 'More' ? ' ▾' : ''}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
