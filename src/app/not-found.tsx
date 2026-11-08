import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '@/styles/prototype.module.css';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className={styles.statePanel} role="alert">
        <h1>Fixture not found</h1>
        <p>This static prototype record does not exist.</p>
        <Link className={styles.detailBack} href="/">
          Back to catalog
        </Link>
      </main>
      <Footer />
    </>
  );
}
