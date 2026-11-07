import { notFound } from 'next/navigation';
import { MovieDetailPrototype } from '@/components/movies/MovieDetailPrototype';
import { getMovieDetail } from '@/lib/detail-fixtures';
import { MOVIES } from '@/lib/fixtures';

export function generateStaticParams() {
  return MOVIES.map((movie) => ({ slug: movie.slug }));
}

export default async function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getMovieDetail(slug);
  if (!detail) notFound();

  return <MovieDetailPrototype detail={detail} />;
}
