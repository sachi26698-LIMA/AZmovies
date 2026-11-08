import { MOVIES } from '@/lib/fixtures';

export type LinkKind = 'quality' | 'watch' | 'provider';

export interface ProviderFixture {
  id: string;
  name: string;
  hostname: string;
}

/**
 * Reserved `.example.com` hosts (IANA reserved for documentation/testing). These are
 * stand-ins, not real providers, and no real destination is stored in the prototype.
 */
export const PROVIDERS: ProviderFixture[] = [
  { id: 'alpha', name: 'Fixture Provider Alpha', hostname: 'alpha.example.com' },
  { id: 'beta', name: 'Fixture Provider Beta', hostname: 'beta.example.com' },
];

export interface LinkTemplate {
  key: string;
  kind: LinkKind;
  label: string;
  quality: string;
  providerId: string;
  note: string;
}

/** Single source of truth shared by the detail page option lists and Page 3. */
export const LINK_TEMPLATES: LinkTemplate[] = [
  {
    key: 'q-480',
    kind: 'quality',
    label: '480p ⚡ [placeholder]',
    quality: '480p',
    providerId: 'alpha',
    note: 'Authorized source not configured',
  },
  {
    key: 'q-720-hevc',
    kind: 'quality',
    label: '720p 10Bit HEVC [placeholder]',
    quality: '720p 10Bit HEVC',
    providerId: 'alpha',
    note: 'Authorized source not configured',
  },
  {
    key: 'q-720-x264',
    kind: 'quality',
    label: '720p x264 [placeholder]',
    quality: '720p x264',
    providerId: 'alpha',
    note: 'Authorized source not configured',
  },
  {
    key: 'q-1080-hevc',
    kind: 'quality',
    label: '1080p 10Bit HEVC [placeholder]',
    quality: '1080p 10Bit HEVC',
    providerId: 'beta',
    note: 'Authorized source not configured',
  },
  {
    key: 'q-1080-x264',
    kind: 'quality',
    label: '1080p x264 [placeholder]',
    quality: '1080p x264',
    providerId: 'beta',
    note: 'Authorized source not configured',
  },
  {
    key: 'q-hq-1080',
    kind: 'quality',
    label: 'HQ 1080p [placeholder]',
    quality: 'HQ 1080p',
    providerId: 'beta',
    note: 'Authorized source not configured',
  },
  {
    key: 'watch-online',
    kind: 'watch',
    label: 'WATCH ONLINE',
    quality: 'Streaming',
    providerId: 'alpha',
    note: 'Authorized watch provider not configured',
  },
  {
    key: 'watch-4k',
    kind: 'watch',
    label: '4K | AVC | DV | HEVC',
    quality: '4K streaming',
    providerId: 'beta',
    note: 'Authorized 4K provider not configured',
  },
  {
    key: 'provider-a',
    kind: 'provider',
    label: 'Authorized provider A — placeholder',
    quality: 'Provider page',
    providerId: 'alpha',
    note: 'Direct redirection disabled until an authorized URL is approved',
  },
  {
    key: 'provider-b',
    kind: 'provider',
    label: 'Authorized provider B — placeholder',
    quality: 'Provider page',
    providerId: 'beta',
    note: 'Direct redirection disabled until an authorized URL is approved',
  },
];

export interface ProviderLinkFixture {
  /** Opaque id used by /go/{id} and /r/{id}. Never a URL or a caller-supplied target. */
  id: string;
  movieSlug: string;
  movieTitle: string;
  kind: LinkKind;
  /** Stable per-movie option key, matching the detail page option lists. */
  optionKey: string;
  label: string;
  quality: string;
  providerId: string;
  providerName: string;
  targetUrl: string;
  status: 'enabled' | 'disabled';
  authorization: 'fixture-placeholder';
  note: string;
}

function providerById(id: string): ProviderFixture {
  const provider = PROVIDERS.find((item) => item.id === id);
  if (!provider) throw new Error(`Unknown fixture provider: ${id}`);
  return provider;
}

function buildTargetUrl(provider: ProviderFixture, slug: string, template: LinkTemplate): string {
  const section = template.kind === 'provider' ? 'provider' : 'watch';
  return `https://${provider.hostname}/${section}/${slug}/${template.key}`;
}

function buildLinks(): ProviderLinkFixture[] {
  const links: ProviderLinkFixture[] = [];
  MOVIES.forEach((movie, movieIndex) => {
    // Exactly one disabled link per movie, never the first option, so the disabled
    // state is demonstrable on every detail page without blocking the main journey.
    const disabledPosition = (movieIndex % 9) + 1;
    LINK_TEMPLATES.forEach((template, position) => {
      const provider = providerById(template.providerId);
      const ordinal = movieIndex * LINK_TEMPLATES.length + position + 1;
      links.push({
        id: `lnk-${String(ordinal).padStart(4, '0')}`,
        movieSlug: movie.slug,
        movieTitle: movie.title,
        kind: template.kind,
        optionKey: template.key,
        label: template.label,
        quality: template.quality,
        providerId: provider.id,
        providerName: provider.name,
        targetUrl: buildTargetUrl(provider, movie.slug, template),
        status: position === disabledPosition ? 'disabled' : 'enabled',
        authorization: 'fixture-placeholder',
        note: template.note,
      });
    });
  });
  return links;
}

export const PROVIDER_LINKS: ProviderLinkFixture[] = buildLinks();

const byId = new Map(PROVIDER_LINKS.map((link) => [link.id, link]));

export function getLinkById(id: string): ProviderLinkFixture | undefined {
  return byId.get(id);
}

export function getLinksForMovie(slug: string): ProviderLinkFixture[] {
  return PROVIDER_LINKS.filter((link) => link.movieSlug === slug);
}

export function getLinkForOption(slug: string, optionKey: string): ProviderLinkFixture | undefined {
  return PROVIDER_LINKS.find((link) => link.movieSlug === slug && link.optionKey === optionKey);
}

export function intermediatePath(linkId: string): string {
  return `/go/${linkId}/`;
}

export function continuePath(linkId: string): string {
  return `/r/${linkId}/`;
}
