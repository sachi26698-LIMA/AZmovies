'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { SideDrawer } from '@/components/layout/SideDrawer';
import { Footer } from '@/components/layout/Footer';
import { TelegramFloating } from '@/components/layout/TelegramFloating';
import { ChevronRightIcon } from '@/components/Icons';
import { continuePath, type ProviderLinkFixture } from '@/lib/link-fixtures';
import { resolveStoredLink, useLinkState } from '@/lib/link-store';
import { resolveContinue } from '@/lib/link-policy';
import { EXTERNAL_ACTIVATION_ENABLED, REDIRECT_ACTIVATION_NOTICE } from '@/lib/redirect-config';
import styles from '@/styles/link-pages.module.css';

interface IntermediateLinkPrototypeProps {
  linkId: string;
}

const kindLabels: Record<ProviderLinkFixture['kind'], string> = {
  quality: 'Quality option',
  watch: 'Watch option',
  provider: 'Provider link',
};

export function IntermediateLinkPrototype({ linkId }: IntermediateLinkPrototypeProps) {
  const router = useRouter();
  const state = useLinkState();
  const link = resolveStoredLink(state, linkId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [continueMessage, setContinueMessage] = useState('');

  const decision = resolveContinue(link, { activationEnabled: EXTERNAL_ACTIVATION_ENABLED });
  const canContinue = decision.action === 'redirect';

  function handleContinue() {
    if (decision.action === 'redirect') {
      // Fresh server-side policy check happens in /r/{linkId}; the browser never
      // receives an arbitrary target from a query parameter.
      router.push(continuePath(linkId));
      return;
    }
    setContinueMessage(decision.message);
  }

  return (
    <div className={styles.page}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header
        onOpenMenu={() => setDrawerOpen(true)}
        // Page 3 has no search field of its own; the shared search control opens the
        // drawer, which focuses its own search input.
        onSearchClick={() => setDrawerOpen(true)}
        menuExpanded={drawerOpen}
      />
      <main id="main-content" className={styles.main}>
        <p className={styles.eyebrow}>AZmovies · Authorized provider handoff</p>
        <h1 className={styles.title}>Continue to your selected link</h1>
        <p className={styles.lede}>
          You are leaving the AZmovies catalog for an external provider page. Check the selection
          below before continuing.
        </p>

        {link ? (
          <section className={styles.panel} aria-label="Selected link details">
            <h2 className={styles.panelTitle}>{link.movieTitle}</h2>
            <dl className={styles.facts}>
              <div className={styles.factRow}>
                <dt>Movie</dt>
                <dd>
                  <Link className={styles.inlineLink} href={`/movies/${link.movieSlug}/`}>
                    {link.movieTitle}
                  </Link>
                </dd>
              </div>
              <div className={styles.factRow}>
                <dt>Selected quality</dt>
                <dd>{link.quality}</dd>
              </div>
              <div className={styles.factRow}>
                <dt>Option</dt>
                <dd>
                  {kindLabels[link.kind]} · {link.label}
                </dd>
              </div>
              <div className={styles.factRow}>
                <dt>Authorized provider</dt>
                <dd>{link.providerName}</dd>
              </div>
              <div className={styles.factRow}>
                <dt>Link status</dt>
                <dd className={link.status === 'enabled' ? styles.okText : styles.warnText}>
                  {link.status === 'enabled' ? 'Enabled' : 'Disabled by administrator'}
                </dd>
              </div>
              <div className={styles.factRow}>
                <dt>Link reference</dt>
                <dd>
                  <code className={styles.code}>{link.id}</code>
                </dd>
              </div>
              <div className={styles.factRow}>
                <dt>Stored destination</dt>
                <dd>
                  <code className={styles.code} data-testid="stored-destination">
                    {link.targetUrl}
                  </code>
                  <span className={styles.factNote}>
                    Fixture address on a reserved example host. Not a real provider page.
                  </span>
                </dd>
              </div>
            </dl>
          </section>
        ) : (
          <section className={styles.panel} aria-label="Selected link details">
            <h2 className={styles.panelTitle}>Link not available</h2>
            <p className={styles.lede}>
              This link reference does not exist, or it was removed in the prototype link manager.
              No destination is shown and nothing is opened.
            </p>
          </section>
        )}

        <p className={styles.notice}>
          <span className={styles.noticeRed}>Prototype mode.</span> {REDIRECT_ACTIVATION_NOTICE}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.continueButton}
            aria-disabled={canContinue ? undefined : 'true'}
            aria-describedby="continue-state"
            onClick={handleContinue}
          >
            Continue <ChevronRightIcon size={20} />
          </button>
          <p id="continue-state" className={styles.actionNote}>
            {canContinue
              ? 'Opens the exact stored authorized destination for this link.'
              : decision.message}
          </p>
          <p className={styles.actionNote} role="status" aria-live="polite">
            {continueMessage}
          </p>
          {link ? (
            <Link className={styles.backLink} href={`/movies/${link.movieSlug}/`}>
              ← Back to Movie Details
            </Link>
          ) : (
            <Link className={styles.backLink} href="/">
              ← Back to catalog
            </Link>
          )}
        </div>

        <section className={styles.safety} aria-label="Handoff policy">
          <h2 className={styles.safetyTitle}>How this handoff works</h2>
          <ul className={styles.safetyList}>
            <li>No automatic redirect, no countdown and no pop-up windows.</li>
            <li>
              The destination is stored against this link id; URLs in query strings are ignored.
            </li>
            <li>Only approved HTTPS hosts pass the destination policy.</li>
            <li>Each quality/provider link is configured, disabled and revoked individually.</li>
          </ul>
        </section>
      </main>
      <Footer />
      <TelegramFloating href={null} />
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
