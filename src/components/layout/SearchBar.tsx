'use client';

import type { FormEvent, RefObject } from 'react';
import styles from '@/styles/prototype.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function SearchBar({ value, onChange, onSubmit, inputRef }: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(value);
  }

  return (
    <form className={styles.searchForm} role="search" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="catalog-search">
        Search movies, series, hindi
      </label>
      <input
        id="catalog-search"
        ref={inputRef}
        className={styles.searchInput}
        type="search"
        name="q"
        placeholder="Search movies,series,hindi"
        maxLength={80}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="submit" className="visually-hidden">
        Search
      </button>
    </form>
  );
}
