import { getMovie, MOVIES, type MovieFixture } from '@/lib/fixtures';
import { getLinksForMovie, type ProviderLinkFixture } from '@/lib/link-fixtures';

export interface LinkPlaceholder {
  id: string;
  label: string;
  href: string | null;
  note: string;
  /** Opaque Page 3 intermediate-link id. Null for non-link placeholders (trailer). */
  linkId: string | null;
}

export interface ScreenshotFixture {
  src: string;
  alt: string;
}

export interface MovieDetailFixture {
  movie: MovieFixture;
  releaseDateLabel: string;
  genres: string[];
  ratingLabel: string;
  cast: string[];
  director: string;
  languageLabel: string;
  qualityLabel: string;
  storyline: string;
  reviewLabel: string;
  screenshots: ScreenshotFixture[];
  qualityOptions: LinkPlaceholder[];
  watchOptions: LinkPlaceholder[];
  providerLinks: LinkPlaceholder[];
  trailer: LinkPlaceholder;
  related: MovieFixture[];
  trending: MovieFixture[];
}

const genreByPoster: Record<MovieFixture['poster'], string[]> = {
  epic: ['Action', 'Adventure', 'Fantasy'],
  odyssey: ['Adventure', 'Action', 'Drama'],
  drama: ['Drama', 'Family'],
  action: ['Action', 'Thriller'],
  comedy: ['Comedy', 'Drama'],
  romance: ['Romance', 'Drama'],
};

const castByPoster: Record<MovieFixture['poster'], string[]> = {
  epic: ['Arjun Mehta', 'Kavya Rao', 'Dev Sen'],
  odyssey: ['Ishaan Verma', 'Mira Nair', 'Kabir Dutta'],
  drama: ['Anand Iyer', 'Priya Menon', 'Rahul Bose'],
  action: ['Vikram Shetty', 'Naina Kapoor', 'Sameer Khan'],
  comedy: ['Rohan Joshi', 'Tara Singh', 'Manav Patel'],
  romance: ['Aditya Roy', 'Sara Ali', 'Nikhil Mathew'],
};

const directorByPoster: Record<MovieFixture['poster'], string> = {
  epic: 'R. K. Sharma',
  odyssey: 'A. Menon',
  drama: 'S. Iyer',
  action: 'V. Shetty',
  comedy: 'M. Patel',
  romance: 'N. Mathew',
};

function placeholder(id: string, label: string, note: string): LinkPlaceholder {
  return { id, label, href: null, note, linkId: null };
}

/**
 * Detail option lists keep their approved labels/notes; each option now also carries
 * the opaque id of its own intermediate link page. No external href is ever set here.
 */
function optionPlaceholder(link: ProviderLinkFixture): LinkPlaceholder {
  return {
    id: link.optionKey,
    label: link.label,
    href: null,
    note: link.note,
    linkId: link.id,
  };
}

export function getMovieDetail(slug: string): MovieDetailFixture | undefined {
  const movie = getMovie(slug);
  if (!movie) return undefined;

  const index = MOVIES.findIndex((item) => item.slug === slug);
  const day = 1 + (index % 27);
  const suffix =
    day === 1 || day === 21
      ? 'st'
      : day === 2 || day === 22
        ? 'nd'
        : day === 3 || day === 23
          ? 'rd'
          : 'th';
  const genres = genreByPoster[movie.poster];
  const rating = (7.2 + (index % 9) * 0.1).toFixed(1);

  const movieLinks = getLinksForMovie(movie.slug);
  const optionsFor = (keys: string[]) =>
    keys
      .map((key) => movieLinks.find((link) => link.optionKey === key))
      .filter((link): link is ProviderLinkFixture => Boolean(link))
      .map(optionPlaceholder);

  const qualityOptions = optionsFor([
    'q-480',
    'q-720-hevc',
    'q-720-x264',
    'q-1080-hevc',
    'q-1080-x264',
    'q-hq-1080',
  ]);
  const watchOptions = optionsFor(['watch-online', 'watch-4k']);
  const providerLinks = optionsFor(['provider-a', 'provider-b']);

  const related = MOVIES.filter((item) => item.slug !== movie.slug)
    .filter((item) => item.categories.some((category) => movie.categories.includes(category)))
    .slice(0, 4);
  const fallbackRelated = MOVIES.filter((item) => item.slug !== movie.slug).slice(0, 4);

  return {
    movie,
    releaseDateLabel: `Nov-${day}${suffix}, ${movie.year}`,
    genres,
    ratingLabel: `${rating}/10`,
    cast: castByPoster[movie.poster],
    director: directorByPoster[movie.poster],
    languageLabel: `Multi Audio [[${movie.languages.join(' + ')}]] / ESubs`,
    qualityLabel: `${movie.quality} 1080p | 720p | 480p`,
    storyline: `${movie.title} is a synthetic fixture synopsis: a wandering hero faces impossible choices, distant seas and fragile alliances while trying to return home. This placeholder description exists only for the Phase 2 visual prototype.`,
    reviewLabel: 'N/A — placeholder review. Please use the future comment section after release.',
    screenshots: [
      {
        src: '/stills/fixture-still-1.jpg',
        alt: `${movie.title} synthetic fixture screenshot: warrior on a ship at sunset`,
      },
      {
        src: '/stills/fixture-still-2.jpg',
        alt: `${movie.title} synthetic fixture screenshot: cloaked figure on a coastal cliff`,
      },
      {
        src: '/stills/fixture-still-3.jpg',
        alt: `${movie.title} synthetic fixture screenshot: elder in desert ruins`,
      },
    ],
    qualityOptions,
    watchOptions,
    providerLinks,
    trailer: placeholder(
      'trailer',
      'Official trailer placeholder',
      'No external video embed is configured',
    ),
    related: related.length > 0 ? related : fallbackRelated,
    trending: MOVIES.slice(0, 8),
  };
}
