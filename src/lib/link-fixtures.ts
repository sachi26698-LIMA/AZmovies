import 'server-only';

import { PUBLIC_LINKS, type PublicLinkFixture } from '@/lib/link-catalog';

/**
 * Server-only synthetic destination inventory. The public catalog and client
 * components must never import this module or receive its records as props.
 * All destinations use reserved example hosts; external activation remains off.
 */
export interface ProviderLinkFixture extends PublicLinkFixture {
  id: string;
  targetUrl: string;
  authorization: 'fixture-placeholder';
}

const FIXTURE_HOSTS: Record<string, string> = {
  alpha: 'alpha.example.com',
  beta: 'beta.example.com',
};

// Preserve the original exact fixture destinations independently of public slugs.
const FIXTURE_TARGET_KEYS: Record<string, string> = {
  '480p': 'q-480',
  '720p-10bit-hevc': 'q-720-hevc',
  '720p-x264': 'q-720-x264',
  '1080p-10bit-hevc': 'q-1080-hevc',
  '1080p-x264': 'q-1080-x264',
  '1080p-hq': 'q-hq-1080',
  'watch-online': 'watch-online',
  'watch-4k': 'watch-4k',
  'provider-a': 'provider-a',
  'provider-b': 'provider-b',
};

function makeServerRecord(link: PublicLinkFixture, index: number): ProviderLinkFixture {
  const host = FIXTURE_HOSTS[link.providerId];
  const targetKey = FIXTURE_TARGET_KEYS[link.optionSlug];
  if (!host || !targetKey) throw new Error('Invalid server fixture configuration');
  const section = link.kind === 'provider' ? 'provider' : 'watch';
  return {
    ...link,
    id: `lnk-${String(index + 1).padStart(4, '0')}`,
    targetUrl: `https://${host}/${section}/${link.movieSlug}/${targetKey}`,
    authorization: 'fixture-placeholder',
  };
}

export const PROVIDER_LINKS: ProviderLinkFixture[] = PUBLIC_LINKS.map(makeServerRecord);

const byId = new Map(PROVIDER_LINKS.map((link) => [link.id, link]));
const bySelection = new Map(
  PROVIDER_LINKS.map((link) => [`${link.movieSlug}/${link.optionSlug}`, link]),
);

/** Used only by server policy/tests; this internal ID is never sent to the browser. */
export function getLinkById(id: string): ProviderLinkFixture | undefined {
  return byId.get(id);
}

export function getLinksForMovie(slug: string): ProviderLinkFixture[] {
  return PROVIDER_LINKS.filter((link) => link.movieSlug === slug);
}

/** Public route selectors identify a catalog choice; the target is always resolved here. */
export function getLinkForOption(
  movieSlug: string,
  optionSlug: string,
): ProviderLinkFixture | undefined {
  return bySelection.get(`${movieSlug}/${optionSlug}`);
}
