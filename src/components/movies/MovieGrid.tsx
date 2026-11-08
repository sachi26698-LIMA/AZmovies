import type { MovieFixture } from '@/lib/fixtures';
import { MovieCard } from '@/components/movies/MovieCard';
import styles from '@/styles/prototype.module.css';

interface MovieGridProps {
  movies: MovieFixture[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section className={styles.gridSection} aria-label="Latest releases">
      <h2 className="visually-hidden">Latest releases</h2>
      <ul className={styles.grid}>
        {movies.map((movie, index) => (
          <li key={movie.slug}>
            <MovieCard movie={movie} priority={index < 2} />
          </li>
        ))}
      </ul>
    </section>
  );
}
