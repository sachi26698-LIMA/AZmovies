'use client';

import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/layout/SearchBar';
import { CategoryButtons } from '@/components/layout/CategoryButtons';
import { SideDrawer } from '@/components/layout/SideDrawer';
import { Footer } from '@/components/layout/Footer';
import { TelegramFloating } from '@/components/layout/TelegramFloating';
import { MovieGrid } from '@/components/movies/MovieGrid';
import { Pagination } from '@/components/movies/Pagination';
import { EmptyCatalog } from '@/components/movies/CatalogStates';
import { filterMovies, PAGE_SIZE } from '@/lib/fixtures';

const drawerCategoryMap: Record<string, string | null> = {
  Bollywood: 'BOLLYWOOD',
  Hollywood: 'HOLLYWOOD',
  'Hindi Dubbed': 'DUAL AUDIO',
  'South Hindi': 'SOUTH INDIAN',
  'Web Series': 'WEB SERIES',
  '18+': '18+',
  GENREs: null,
  More: null,
};

export function PrototypeHome() {
  const searchParams = useSearchParams();
  const initialQuery = (searchParams?.get('q') ?? '').slice(0, 80);
  return <PrototypeHomeContent initialQuery={initialQuery} />;
}

interface PrototypeHomeContentProps {
  initialQuery?: string;
}

export function PrototypeHomeContent({ initialQuery = '' }: PrototypeHomeContentProps) {
  const [query, setQuery] = useState(initialQuery);
  const [searchDraft, setSearchDraft] = useState(initialQuery);
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterMovies(query, category), [query, category]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function selectCategory(next: string) {
    setCategory((current) => (current === next ? null : next));
    setPage(1);
  }

  function submitSearch(next: string) {
    setQuery(next);
    setSearchDraft(next);
    setPage(1);
  }

  function resetFilters() {
    setQuery('');
    setSearchDraft('');
    setCategory(null);
    setPage(1);
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header
        onOpenMenu={() => setDrawerOpen(true)}
        onSearchClick={() => searchRef.current?.focus()}
        menuExpanded={drawerOpen}
      />
      <main id="main-content">
        <h1 className="visually-hidden">AZmovies latest releases</h1>
        <SearchBar
          value={searchDraft}
          onChange={setSearchDraft}
          onSubmit={submitSearch}
          inputRef={searchRef}
        />
        <CategoryButtons activeCategory={category} onSelect={selectCategory} />
        {visible.length > 0 ? (
          <MovieGrid movies={visible} />
        ) : (
          <EmptyCatalog onReset={resetFilters} />
        )}
        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
      </main>
      <Footer />
      <TelegramFloating href={null} />
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSearch={submitSearch}
        onNavigate={(label) => {
          const mapped = drawerCategoryMap[label];
          if (mapped) selectCategory(mapped);
        }}
      />
    </>
  );
}
