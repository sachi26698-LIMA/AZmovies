import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getMovie, MOVIES, posterSrc } from '@/lib/fixtures';
import styles from '@/styles/prototype.module.css';

export function generateStaticParams() {
  return MOVIES.map((movie) => ({ slug: movie.slug }));
}

export default async function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const movie = getMovie(slug);
  if (!movie) notFound();

  return (
    <>
      <Header />
      <main id="main-content" className={styles.detail}>
        <Link className={styles.detailBack} href="/">
          Back to catalog
        </Link>
        <div className={styles.detailPoster}>
          <span className={styles.cardPosterFrame}>
            <Image
              src={posterSrc(movie.poster)}
              alt={`${movie.title} fixture poster`}
              width={480}
              height={720}
              sizes="260px"
              priority
              className={styles.cardPosterImage}
            />
          </span>
        </div>
        <h1 className={styles.detailTitle}>{movie.displayTitle}</h1>
        <p className={styles.detailMeta}>
          {movie.year} · {movie.languages.join(' + ')} · {movie.quality}
        </p>
        <p className={styles.detailSynopsis}>{movie.synopsis}</p>
        <p className={styles.detailMeta}>
          Static fixture detail. No external movie-page action is available in Phase 2.
        </p>
      </main>
      <Footer />
    </>
  );
}
