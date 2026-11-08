import type { Metadata } from 'next';
import { LinkManagerPrototype } from '@/components/links/LinkManagerPrototype';
import styles from '@/styles/link-pages.module.css';

export const metadata: Metadata = {
  title: 'AZmovies — Prototype link manager',
  robots: { index: false, follow: false },
};

/**
 * Fixture-only prototype of per-link administration. Not authenticated and not
 * persisted: it exists to demonstrate independent link configuration and URL
 * validation before the real admin phase. See PAGE3_REPORT.md.
 */
export default function AdminLinksPage() {
  return (
    <div className={styles.page}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <LinkManagerPrototype />
    </div>
  );
}
