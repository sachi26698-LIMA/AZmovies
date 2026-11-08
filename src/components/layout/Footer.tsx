import styles from '@/styles/prototype.module.css';

const FOOTER_LINKS = ['Disclaimer', 'Join Our Group!', 'How To Watch?', 'Movie Request Page'];

export function Footer({ showPrototypeNote = true }: { showPrototypeNote?: boolean }) {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerCopyright}>
        2026 © <span className={styles.footerBrand}>AZmovies</span> | All Rights Reserved.
      </p>
      <nav className={styles.footerNav} aria-label="Footer">
        {FOOTER_LINKS.map((label) => (
          <button
            key={label}
            type="button"
            className={styles.footerLink}
            aria-disabled="true"
            title="Static prototype only; no destination is configured"
          >
            {label}
          </button>
        ))}
      </nav>
      {showPrototypeNote ? (
        <p className={styles.footerNote}>
          Static fixture prototype. No live movie APIs, database, authentication or external
          redirects.
        </p>
      ) : null}
    </footer>
  );
}
