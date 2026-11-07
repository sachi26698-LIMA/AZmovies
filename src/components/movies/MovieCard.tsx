import Image from 'next/image';
import { posterSrc, type MovieFixture } from '@/lib/fixtures';
import styles from '@/styles/prototype.module.css';

interface MovieCardProps {
  movie: MovieFixture;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  return (
    <article className={styles.card}>
      <a className={styles.cardPosterLink} href={`/movies/${movie.slug}/`}>
        <span className={styles.cardPosterFrame}>
          <Image
            src={posterSrc(movie.poster)}
            alt={`${movie.title} fixture poster`}
            width={480}
            height={720}
            sizes="(min-width: 768px) 240px, 46vw"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className={styles.cardPosterImage}
          />
        </span>
      </a>
      <h3 className={styles.cardTitle}>
        <a href={`/movies/${movie.slug}/`}>{movie.displayTitle}</a>
      </h3>
    </article>
  );
}
