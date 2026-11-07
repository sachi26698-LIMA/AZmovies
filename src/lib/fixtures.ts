export type PosterVariant = 'epic' | 'odyssey' | 'drama' | 'action' | 'comedy' | 'romance';

export interface MovieFixture {
  id: string;
  slug: string;
  title: string;
  displayTitle: string;
  year: number;
  languages: string[];
  quality: 'HD' | 'FHD' | '4K';
  categories: string[];
  poster: PosterVariant;
  synopsis: string;
}

export const SPECIAL_BUTTONS = [
  { label: 'ANIME', tone: 'green', kind: 'category' },
  { label: 'DESI VIDEOS', tone: 'red-top', kind: 'category' },
  { label: 'FMOVIES', tone: 'green', kind: 'category' },
  { label: 'JOIN TELEGRAM', tone: 'blue', kind: 'inactive' },
  { label: 'DOWNLOAD APP', tone: 'orange', kind: 'inactive' },
] as const;

export const CATEGORY_ROWS = [
  ['18+', 'BANGALI', 'BOLLYWOOD'],
  ['CHINESE', 'DUAL AUDIO', 'ENGLISH'],
  ['GUJARATI', 'HINDI', 'HOLLYWOOD'],
  ['KANNADA', 'KOREAN', 'MALAYALAM'],
  ['MARATHI', 'ODIA', 'PUNJABI'],
  ['SOUTH INDIAN', 'TAMIL', 'TELUGU'],
  ['TV SHOW', 'URDU', 'WEB SERIES'],
] as const;

export const DRAWER_LINKS = [
  'AZmovies Home',
  'Bollywood',
  'Hollywood',
  'Hindi Dubbed',
  'South Hindi',
  'Web Series',
  '18+',
  'GENREs',
  'More',
] as const;

const templates: Array<{
  title: string;
  poster: PosterVariant;
  languages: string[];
  categories: string[];
}> = [
  {
    title: 'Aranya: Rise of a Legend',
    poster: 'epic',
    languages: ['Hindi', 'Multi Audio'],
    categories: ['BOLLYWOOD', 'HINDI', 'DUAL AUDIO'],
  },
  {
    title: 'The Odyssey Protocol',
    poster: 'odyssey',
    languages: ['Hindi', 'English'],
    categories: ['HOLLYWOOD', 'ENGLISH', 'DUAL AUDIO'],
  },
  {
    title: 'Madraskaaran Returns',
    poster: 'drama',
    languages: ['Hindi', 'Tamil'],
    categories: ['SOUTH INDIAN', 'TAMIL', 'HINDI'],
  },
  {
    title: 'Jailer’s Shadow',
    poster: 'action',
    languages: ['Hindi', 'Tamil', 'Telugu'],
    categories: ['SOUTH INDIAN', 'TAMIL', 'TELUGU', 'DUAL AUDIO'],
  },
  {
    title: 'The Great Indian Comedy Night',
    poster: 'comedy',
    languages: ['Hindi'],
    categories: ['TV SHOW', 'WEB SERIES', 'HINDI'],
  },
  {
    title: 'Lupin’s Heir',
    poster: 'odyssey',
    languages: ['Hindi', 'English'],
    categories: ['WEB SERIES', 'ENGLISH', 'DUAL AUDIO'],
  },
  {
    title: 'Scene of Monsoon',
    poster: 'romance',
    languages: ['Tamil'],
    categories: ['TAMIL', 'SOUTH INDIAN'],
  },
  {
    title: 'Ramayan: The Lost Empire',
    poster: 'epic',
    languages: ['Hindi', 'Sanskrit'],
    categories: ['BOLLYWOOD', 'HINDI'],
  },
  {
    title: 'Dhurandhar Files',
    poster: 'action',
    languages: ['Hindi', 'Punjabi'],
    categories: ['BOLLYWOOD', 'PUNJABI', 'HINDI'],
  },
  {
    title: 'Hot Spot Express',
    poster: 'comedy',
    languages: ['Hindi', 'Gujarati'],
    categories: ['GUJARATI', 'HINDI', 'COMEDY'],
  },
  {
    title: 'Gustaakh Ishq',
    poster: 'romance',
    languages: ['Urdu', 'Hindi'],
    categories: ['URDU', 'HINDI', 'ROMANCE'],
  },
  {
    title: 'Notebook of Dreams',
    poster: 'drama',
    languages: ['English'],
    categories: ['ENGLISH', 'HOLLYWOOD', 'DRAMA'],
  },
];

const qualityCycle = ['HD', 'FHD', '4K'] as const;
const posterPath: Record<PosterVariant, string> = {
  epic: '/posters/fixture-epic.jpg',
  odyssey: '/posters/fixture-odyssey.jpg',
  drama: '/posters/fixture-drama.jpg',
  action: '/posters/fixture-action.jpg',
  comedy: '/posters/fixture-comedy.jpg',
  romance: '/posters/fixture-romance.jpg',
};

export function posterSrc(variant: PosterVariant): string {
  return posterPath[variant];
}

export const MOVIES: MovieFixture[] = Array.from({ length: 48 }, (_, index) => {
  const template = templates[index % templates.length]!;
  const part = Math.floor(index / templates.length);
  const year = 2026 - (index % 3);
  const quality = qualityCycle[index % qualityCycle.length]!;
  const title = part === 0 ? template.title : `${template.title} ${['II', 'III', 'IV'][part - 1]}`;
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index + 1}`;
  const languageText = template.languages.join(' + ');
  return {
    id: `fixture-${String(index + 1).padStart(3, '0')}`,
    slug,
    title,
    displayTitle: `${title} (${year}) Dual Audio [${languageText}] ${quality} | 720p | 1080p`,
    year,
    languages: template.languages,
    quality,
    categories: template.categories,
    poster: template.poster,
    synopsis:
      ' Synthetic fixture synopsis for the AZmovies static visual prototype. This record is not connected to a live metadata provider, database, authentication system or external movie page.',
  };
});

export const PAGE_SIZE = 6;

export function filterMovies(query: string, category: string | null): MovieFixture[] {
  const q = query.trim().toLowerCase();
  return MOVIES.filter((movie) => {
    const matchesCategory = !category || movie.categories.includes(category);
    const matchesQuery =
      q.length === 0 ||
      movie.title.toLowerCase().includes(q) ||
      movie.displayTitle.toLowerCase().includes(q) ||
      movie.languages.some((language) => language.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });
}

export function getMovie(slug: string): MovieFixture | undefined {
  return MOVIES.find((movie) => movie.slug === slug);
}
