'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { SideDrawer } from '@/components/layout/SideDrawer';
import { Footer } from '@/components/layout/Footer';
import { ChevronRightIcon } from '@/components/Icons';
import styles from '@/styles/link-pages.module.css';

/** Only this public summary crosses the server/client boundary. */
export interface HandoffSummary {
  movieSlug: string;
  movieTitle: string;
  quality: string;
  providerName: string;
  continueHref: string;
  canContinue: boolean;
  continueMessage: string;
}

interface IntermediateLinkPrototypeProps {
  selection: HandoffSummary;
}

export function IntermediateLinkPrototype({ selection }: IntermediateLinkPrototypeProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.page}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header
        onOpenMenu={() => setDrawerOpen(true)}
        onSearchClick={() => setDrawerOpen(true)}
        menuExpanded={drawerOpen}
      />
      <main id="main-content" className={styles.main}>
        <p className={styles.eyebrow}>AZmovies · Provider handoff</p>
        <h1 className={styles.title}>Continue to your selected link</h1>
        <p className={styles.lede}>Review your selection before continuing.</p>

        <section className={styles.panel} aria-label="Selected link details">
          <dl className={styles.facts}>
            <div className={styles.factRow}>
              <dt>Movie</dt>
              <dd>{selection.movieTitle}</dd>
            </div>
            <div className={styles.factRow}>
              <dt>Selected quality</dt>
              <dd>{selection.quality}</dd>
            </div>
            <div className={styles.factRow}>
              <dt>Provider</dt>
              <dd>{selection.providerName}</dd>
            </div>
          </dl>
        </section>

        <p className={styles.notice}>
          <span className={styles.noticeRed}>Prototype mode.</span> External destinations are
          disabled until authorized and approved.
        </p>

        <div className={styles.actions}>
          <form action={selection.continueHref} method="get">
            <button
              type="submit"
              className={styles.continueButton}
              disabled={!selection.canContinue}
              aria-describedby="continue-state"
            >
              Continue <ChevronRightIcon size={20} />
            </button>
          </form>
          <p id="continue-state" className={styles.actionNote}>
            {selection.continueMessage}
          </p>
          <Link className={styles.backLink} href={`/movies/${selection.movieSlug}/`}>
            ← Back to Movie Details
          </Link>
        </div>
      </main>
      <Footer showPrototypeNote={false} />
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSearch={(query) =>
          router.push(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : '/')
        }
        onNavigate={(label) =>
          router.push(label === 'AZmovies Home' ? '/' : `/?q=${encodeURIComponent(label)}`)
        }
      />
    </div>
  );
}
