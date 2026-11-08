import { getMovie, MOVIES, type MovieFixture } from '@/lib/fixtures';
import {
  getPublicLinksForMovie,
  intermediatePath,
  type PublicLinkFixture,
} from '@/lib/link-catalog';

export interface LinkPlaceholder {
  /** Descriptive public slug, not an internal link-record ID. */
  optionSlug: string;
  label: string;
  href: string | null;
  note: string;
  disabled: boolean;
  emphasized: boolean;
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

function placeholder(optionSlug: string, label: string, note: string): LinkPlaceholder {
  return { optionSlug, label, href: null, note, disabled: true, emphasized: false };
}

/** Public detail props contain only descriptive selectors and never server records. */
function optionPlaceholder(link: PublicLinkFixture): LinkPlaceholder {
  return {
    optionSlug: link.optionSlug,
    label: link.label,
    href: intermediatePath(link.movieSlug, link.optionSlug),
    note: link.note,
    disabled: link.status === 'disabled',
    emphasized: link.emphasized,
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

  const movieLinks = getPublicLinksForMovie(movie.slug);
  const optionsFor = (slugs: string[]) =>
    slugs
      .map((slug) => movieLinks.find((link) => link.optionSlug === slug))
      .filter((link): link is PublicLinkFixture => Boolean(link))
      .map(optionPlaceholder);

  const qualityOptions = optionsFor([
    '480p',
    '720p-10bit-hevc',
    '720p-x264',
    '1080p-10bit-hevc',
    '1080p-x264',
    '1080p-hq',
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
    languageLabel:
      movie.languages.length > 1
        ? `Multi Audio [[${movie.languages.join(' + ')}]] / ESubs`
        : `${movie.languages[0]} / ESubs`,
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
