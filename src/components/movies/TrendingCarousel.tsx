import Image from 'next/image';
import Link from 'next/link';
import { posterSrc, type MovieFixture } from '@/lib/fixtures';
import styles from '@/styles/detail.module.css';

interface TrendingCarouselProps {
  movies: MovieFixture[];
}

export function TrendingCarousel({ movies }: TrendingCarouselProps) {
  return (
    <section className={styles.trending} aria-label="Trending movies">
      <ul className={styles.trendingList}>
        {movies.map((movie) => (
          <li key={movie.id} className={styles.trendingItem}>
            <Link href={`/movies/${movie.slug}/`} aria-label={`${movie.title} detail`}>
              <Image
                src={posterSrc(movie.poster)}
                alt={`${movie.title} fixture poster`}
                width={480}
                height={720}
                sizes="104px"
                className={styles.trendingPoster}
                loading="lazy"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
