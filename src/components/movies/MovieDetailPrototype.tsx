'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { DetailToolbar } from '@/components/layout/DetailToolbar';
import { SideDrawer } from '@/components/layout/SideDrawer';
import { Footer } from '@/components/layout/Footer';
import { TelegramFloating } from '@/components/layout/TelegramFloating';
import { TrendingCarousel } from '@/components/movies/TrendingCarousel';
import { ScreenshotGallery } from '@/components/movies/ScreenshotGallery';
import { LinkOptionList } from '@/components/movies/LinkOptionList';
import { MovieCard } from '@/components/movies/MovieCard';
import { posterSrc } from '@/lib/fixtures';
import { CalendarIcon, ClapperIcon, FolderIcon, HomeIcon, PlayIcon } from '@/components/Icons';
import type { MovieDetailFixture } from '@/lib/detail-fixtures';
import styles from '@/styles/detail.module.css';

interface MovieDetailPrototypeProps {
  detail: MovieDetailFixture;
}

export function MovieDetailPrototype({ detail }: MovieDetailPrototypeProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { movie } = detail;

  function handleDrawerSearch(query: string) {
    router.push(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : '/');
  }

  function handleDrawerNavigate(label: string) {
    router.push(label === 'AZmovies Home' ? '/' : `/?q=${encodeURIComponent(label)}`);
  }

  return (
    <div className={styles.page}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header
        onOpenMenu={() => setDrawerOpen(true)}
        onSearchClick={() => searchRef.current?.focus()}
        menuExpanded={drawerOpen}
      />
      <main id="main-content" className={styles.main}>
        <TrendingCarousel movies={detail.trending} />
        <DetailToolbar
          onOpenMenu={() => setDrawerOpen(true)}
          menuExpanded={drawerOpen}
          inputRef={searchRef}
        />

        <p className={styles.noticePanel}>
          <span className={styles.noticeRed}>Static fixture preview.</span> Always use authorized
          AZmovies provider links. <span className={styles.noticeBlue}>No download sources</span>{' '}
          are configured in Phase 2.
        </p>
        <Link className={styles.goHome} href="/" aria-label="Go to HomePage, back to catalog">
          Go to HomePage <HomeIcon size={16} className={styles.inlineIcon} />
        </Link>

        <section className={styles.titlePanel} aria-label="Movie title">
          <h1 className={styles.title}>
            <ClapperIcon size={20} className={styles.inlineIcon} />
            {movie.title} ({movie.year}) {movie.quality} | {detail.languageLabel} | Fixture Preview
          </h1>
        </section>

        <ul className={styles.chips} aria-label="Release date and genres">
          <li className={styles.dateChip}>
            <CalendarIcon size={14} className={styles.inlineIcon} />
            {detail.releaseDateLabel}
          </li>
          {detail.genres.map((genre) => (
            <li key={genre} className={styles.chip}>
              <FolderIcon size={14} className={styles.inlineIcon} />
              {genre}
            </li>
          ))}
          <li className={styles.chip}>
            <FolderIcon size={14} className={styles.inlineIcon} />
            Dual Audio
          </li>
        </ul>

        <hr className={styles.rule} />
        <p className={styles.italicText}>
          Watch {movie.title} ({movie.year}) fixture preview in {movie.languages.join(' + ')}. This
          page is static prototype data only.
        </p>

        <figure className={styles.posterWrap}>
          <Image
            src={posterSrc(movie.poster)}
            alt={`${movie.title} large fixture poster`}
            width={480}
            height={720}
            sizes="(min-width: 768px) 320px, 88vw"
            priority
            className={styles.posterImage}
          />
        </figure>

        <Link className={styles.howToWatch} href="#watch-options">
          [How To Watch <PlayIcon size={16} className={styles.inlineIcon} /> ]
        </Link>

        <section className={styles.infoSection} aria-label="Detailed movie information">
          <h2 className={styles.infoTitle}>
            {movie.title} ({movie.languages[0]} Dubbed)
          </h2>
          <dl className={styles.infoList}>
            <div className={styles.infoRow}>
              <dt>iMDB Rating:</dt> <dd className={styles.blueText}>{detail.ratingLabel}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>Genre:</dt> <dd>{detail.genres.join(' | ')}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>Stars:</dt> <dd>{detail.cast.join(', ')}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>Director:</dt> <dd>{detail.director}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>Language:</dt> <dd className={styles.redText}>{detail.languageLabel}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>Quality:</dt> <dd className={styles.redText}>{detail.qualityLabel}</dd>
            </div>
          </dl>
        </section>

        <hr className={styles.rule} />
        <section aria-label="Movie screenshots">
          <h2 className={styles.redHeading}>: Screen-Shots :</h2>
          <ScreenshotGallery screenshots={detail.screenshots} />
        </section>

        <section
          className={styles.optionsSection}
          id="quality-options"
          aria-label="Quality options"
        >
          <h2 className={styles.sectionTitle}>
            {movie.title} ({movie.year}) Fixture Movie Multi-Audio [Hindi &amp; English] HD
          </h2>
          <h3 className={styles.redHeading}>: QUALITY OPTIONS :</h3>
          <LinkOptionList label="Quality option placeholders" options={detail.qualityOptions} />
        </section>

        <section className={styles.optionsSection} id="watch-options" aria-label="Watch options">
          <h2 className="visually-hidden">Watch options</h2>
          <LinkOptionList
            label="Watch option placeholders"
            options={detail.watchOptions}
            tone="teal"
          />
          <h3 className={styles.sectionTitle}>Authorized provider links</h3>
          <LinkOptionList label="Authorized provider placeholders" options={detail.providerLinks} />
          <p className={styles.providerNote}>
            Direct external redirection is disabled until the owner supplies approved authorized
            URLs. These are placeholders, not download sources.
          </p>
        </section>

        <section className={styles.trailerBox} aria-label="Trailer placeholder">
          <h2 className={styles.sectionTitle}>{detail.trailer.label}</h2>
          <button
            type="button"
            className={styles.playButton}
            aria-disabled="true"
            title={detail.trailer.note}
          >
            <PlayIcon size={20} />
          </button>
          <p className={styles.providerNote}>{detail.trailer.note}</p>
        </section>

        <section aria-label="Storyline">
          <h2 className={styles.sectionTitle}>
            {movie.title} ({movie.year}) Fixture Movie –{' '}
            <span className={styles.redText}>Storyline :</span>
          </h2>
          <p className={styles.italicText}>{detail.storyline}</p>
        </section>

        <section aria-label="Review">
          <h2 className={styles.sectionTitle}>
            Fixture Review – <span className={styles.redText}>Review :</span>
          </h2>
          <p className={styles.italicText}>{detail.reviewLabel}</p>
        </section>

        <section className={styles.reactions} aria-label="Reaction placeholders">
          <h2 className={styles.sectionTitle}>Did you like it?</h2>
          <p className={styles.blueText}>23 placeholder reactions</p>
          <ul className={styles.reactionList}>
            {['★ Excellent', '♥ Loved', '☺ Thanks', '☆ Wow', '☹ Sad'].map((label) => (
              <li key={label}>
                <button type="button" className={styles.reactionButton} aria-disabled="true">
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.related} aria-label="Related movies">
          <h2 className={styles.sectionTitle}>Related movies</h2>
          <ul className={styles.relatedGrid}>
            {detail.related.map((relatedMovie) => (
              <li key={relatedMovie.id}>
                <MovieCard movie={relatedMovie} />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
      <TelegramFloating href={null} />
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSearch={handleDrawerSearch}
        onNavigate={handleDrawerNavigate}
      />
    </div>
  );
}
