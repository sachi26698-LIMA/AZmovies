import { MOVIES } from '@/lib/fixtures';

/** Public fixture descriptions. This module intentionally contains no destination URLs or internal link IDs. */
export type LinkKind = 'quality' | 'watch' | 'provider';

export interface ProviderFixture {
  id: string;
  name: string;
}

export const PROVIDERS: ProviderFixture[] = [
  { id: 'alpha', name: 'Fixture Provider Alpha' },
  { id: 'beta', name: 'Fixture Provider Beta' },
];

export interface LinkTemplate {
  /** Human-readable public option slug, not a database or link-record ID. */
  slug: string;
  kind: LinkKind;
  label: string;
  quality: string;
  providerId: string;
  note: string;
  emphasized?: boolean;
}

/** The labels and public option slugs describe the selected option, not a destination. */
export const LINK_TEMPLATES: LinkTemplate[] = [
  {
    slug: '480p',
    kind: 'quality',
    label: '480p',
    quality: '480p',
    providerId: 'alpha',
    note: 'Fixture option; no external destination is active.',
  },
  {
    slug: '720p-10bit-hevc',
    kind: 'quality',
    label: '720p 10Bit HEVC',
    quality: '720p 10Bit HEVC',
    providerId: 'alpha',
    note: 'Fixture option; no external destination is active.',
    emphasized: true,
  },
  {
    slug: '720p-x264',
    kind: 'quality',
    label: '720p x264',
    quality: '720p x264',
    providerId: 'alpha',
    note: 'Fixture option; no external destination is active.',
  },
  {
    slug: '1080p-10bit-hevc',
    kind: 'quality',
    label: '1080p 10Bit HEVC',
    quality: '1080p 10Bit HEVC',
    providerId: 'beta',
    note: 'Fixture option; no external destination is active.',
    emphasized: true,
  },
  {
    slug: '1080p-x264',
    kind: 'quality',
    label: '1080p x264',
    quality: '1080p x264',
    providerId: 'beta',
    note: 'Fixture option; no external destination is active.',
  },
  {
    slug: '1080p-hq',
    kind: 'quality',
    label: 'HQ 1080p',
    quality: 'HQ 1080p',
    providerId: 'beta',
    note: 'Fixture option; no external destination is active.',
  },
  {
    slug: 'watch-online',
    kind: 'watch',
    label: 'WATCH ONLINE',
    quality: 'Streaming',
    providerId: 'alpha',
    note: 'Fixture option; no external destination is active.',
  },
  {
    slug: 'watch-4k',
    kind: 'watch',
    label: '4K | AVC | DV | HEVC',
    quality: '4K streaming',
    providerId: 'beta',
    note: 'Fixture option; no external destination is active.',
  },
  {
    slug: 'provider-a',
    kind: 'provider',
    label: 'Fixture provider A',
    quality: 'Provider page',
    providerId: 'alpha',
    note: 'Fixture option; no external destination is active.',
  },
  {
    slug: 'provider-b',
    kind: 'provider',
    label: 'Fixture provider B',
    quality: 'Provider page',
    providerId: 'beta',
    note: 'Fixture option; no external destination is active.',
  },
];

/** This is the complete shape allowed in client-side fixture data. */
export interface PublicLinkFixture {
  movieSlug: string;
  movieTitle: string;
  optionSlug: string;
  kind: LinkKind;
  label: string;
  quality: string;
  providerId: string;
  providerName: string;
  status: 'enabled' | 'disabled';
  note: string;
  emphasized: boolean;
}

function buildPublicLinks(): PublicLinkFixture[] {
  return MOVIES.flatMap((movie, movieIndex) => {
    // One disabled option per movie, never the first, demonstrates the safe state.
    const disabledPosition = (movieIndex % 9) + 1;
    return LINK_TEMPLATES.map((template, position) => {
      const provider = PROVIDERS.find((item) => item.id === template.providerId);
      if (!provider) throw new Error(`Unknown fixture provider: ${template.providerId}`);
      return {
        movieSlug: movie.slug,
        movieTitle: movie.title,
        optionSlug: template.slug,
        kind: template.kind,
        label: template.label,
        quality: template.quality,
        providerId: provider.id,
        providerName: provider.name,
        status: position === disabledPosition ? 'disabled' : 'enabled',
        note: template.note,
        emphasized: template.emphasized ?? false,
      };
    });
  });
}

export const PUBLIC_LINKS = buildPublicLinks();

export function getPublicLinksForMovie(slug: string): PublicLinkFixture[] {
  return PUBLIC_LINKS.filter((link) => link.movieSlug === slug);
}

export function getPublicLink(
  movieSlug: string,
  optionSlug: string,
): PublicLinkFixture | undefined {
  return PUBLIC_LINKS.find(
    (link) => link.movieSlug === movieSlug && link.optionSlug === optionSlug,
  );
}

/** Public routes use descriptive catalog slugs, not internal link-record IDs or URLs. */
export function intermediatePath(movieSlug: string, optionSlug: string): string {
  return `/go/${encodeURIComponent(movieSlug)}/${encodeURIComponent(optionSlug)}/`;
}

export function continuePath(movieSlug: string, optionSlug: string): string {
  return `/r/${encodeURIComponent(movieSlug)}/${encodeURIComponent(optionSlug)}/`;
}
