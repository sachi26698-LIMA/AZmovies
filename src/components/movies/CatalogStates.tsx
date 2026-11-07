import styles from '@/styles/prototype.module.css';

export function EmptyCatalog({ onReset }: { onReset: () => void }) {
  return (
    <section className={styles.statePanel} role="status">
      <h2>No fixture matches</h2>
      <p>No synthetic catalog records match the current search or category.</p>
      <button type="button" className={styles.stateButton} onClick={onReset}>
        Reset filters
      </button>
    </section>
  );
}

export function LoadingCatalog() {
  return (
    <section className={styles.statePanel} role="status" aria-live="polite">
      <h2>Loading fixtures</h2>
      <p>Preparing the static catalog preview.</p>
    </section>
  );
}

export function ErrorCatalog({ onRetry }: { onRetry: () => void }) {
  return (
    <section className={styles.statePanel} role="alert">
      <h2>Preview unavailable</h2>
      <p>The static fixture preview could not be displayed. No live service is contacted.</p>
      <button type="button" className={styles.stateButton} onClick={onRetry}>
        Retry preview
      </button>
    </section>
  );
}
