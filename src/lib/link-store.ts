'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { PUBLIC_LINKS, type LinkKind, type PublicLinkFixture } from '@/lib/link-catalog';
import type { LinkStatus } from '@/lib/link-policy';

/**
 * Isolated browser-session demo state. It contains no server link IDs or stored
 * destinations, and changes here never alter the public catalog or server mapping.
 * URL input is validated in the manager and then discarded, not saved here.
 */
export const LINK_STORAGE_KEY = 'azmovies.prototype.link-demo.v2';

export interface DemoLink extends PublicLinkFixture {
  demoKey: string;
  draftOnly: boolean;
  hasValidatedDraft: boolean;
}

export interface LinkOverride {
  deleted?: boolean;
  label?: string;
  quality?: string;
  providerId?: string;
  providerName?: string;
  status?: LinkStatus;
  hasValidatedDraft?: boolean;
}

export interface LinkOverrideState {
  overrides: Record<string, LinkOverride>;
  added: DemoLink[];
}

export const EMPTY_LINK_STATE: LinkOverrideState = { overrides: {}, added: [] };

const CHANGE_EVENT = 'azmovies:link-demo';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** This key is made from public descriptors and is only used inside the demo. */
export function demoKeyFor(link: PublicLinkFixture): string {
  return `${link.movieSlug}/${link.optionSlug}`;
}

function parseAdded(value: unknown): DemoLink | undefined {
  if (!isRecord(value)) return undefined;
  if (
    typeof value.demoKey !== 'string' ||
    !value.demoKey.startsWith('draft/') ||
    typeof value.movieSlug !== 'string' ||
    typeof value.movieTitle !== 'string' ||
    typeof value.label !== 'string' ||
    typeof value.quality !== 'string' ||
    typeof value.providerId !== 'string' ||
    typeof value.providerName !== 'string' ||
    (value.status !== 'enabled' && value.status !== 'disabled')
  ) {
    return undefined;
  }
  return {
    demoKey: value.demoKey,
    movieSlug: value.movieSlug,
    movieTitle: value.movieTitle,
    optionSlug: 'draft',
    kind: 'provider',
    label: value.label,
    quality: value.quality,
    providerId: value.providerId,
    providerName: value.providerName,
    status: value.status,
    note: 'Isolated demo draft; it does not publish a provider link.',
    emphasized: false,
    draftOnly: true,
    hasValidatedDraft: value.hasValidatedDraft === true,
  };
}

export function parseLinkState(raw: string): LinkOverrideState {
  if (!raw) return EMPTY_LINK_STATE;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return EMPTY_LINK_STATE;
    const overrides: Record<string, LinkOverride> = {};
    if (isRecord(parsed.overrides)) {
      for (const [key, value] of Object.entries(parsed.overrides)) {
        if (!isRecord(value)) continue;
        const entry: LinkOverride = {};
        if (value.deleted === true) entry.deleted = true;
        if (typeof value.label === 'string') entry.label = value.label;
        if (typeof value.quality === 'string') entry.quality = value.quality;
        if (typeof value.providerId === 'string') entry.providerId = value.providerId;
        if (typeof value.providerName === 'string') entry.providerName = value.providerName;
        if (value.status === 'enabled' || value.status === 'disabled') entry.status = value.status;
        if (value.hasValidatedDraft === true) entry.hasValidatedDraft = true;
        overrides[key] = entry;
      }
    }
    const added = Array.isArray(parsed.added)
      ? parsed.added.map(parseAdded).filter((item): item is DemoLink => Boolean(item))
      : [];
    return { overrides, added };
  } catch {
    return EMPTY_LINK_STATE;
  }
}

export function readRawLinkState(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.sessionStorage.getItem(LINK_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function writeLinkState(state: LinkOverrideState): void {
  if (typeof window === 'undefined') return;
  try {
    // Strip unexpected properties before storing; the test-destination field is never persisted.
    const raw = JSON.stringify(parseLinkState(JSON.stringify(state)));
    if (raw === JSON.stringify(EMPTY_LINK_STATE)) {
      window.sessionStorage.removeItem(LINK_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(LINK_STORAGE_KEY, raw);
    }
  } catch {
    // Storage may be unavailable (private mode/quota). The demo stays usable.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToLinkState(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function applyLinkOverrides(state: LinkOverrideState): DemoLink[] {
  const base: DemoLink[] = PUBLIC_LINKS.map((link) => ({
    ...link,
    demoKey: demoKeyFor(link),
    draftOnly: false,
    hasValidatedDraft: false,
  }));
  return [...base, ...state.added]
    .filter((link) => !state.overrides[link.demoKey]?.deleted)
    .map((link) => {
      const override = state.overrides[link.demoKey];
      if (!override) return link;
      return {
        ...link,
        label: override.label ?? link.label,
        quality: override.quality ?? link.quality,
        providerId: override.providerId ?? link.providerId,
        providerName: override.providerName ?? link.providerName,
        status: override.status ?? link.status,
        hasValidatedDraft: override.hasValidatedDraft ?? link.hasValidatedDraft,
      };
    });
}

export function resolveDemoLink(state: LinkOverrideState, demoKey: string): DemoLink | undefined {
  return applyLinkOverrides(state).find((link) => link.demoKey === demoKey);
}

export function useLinkState(): LinkOverrideState {
  const raw = useSyncExternalStore(subscribeToLinkState, readRawLinkState, () => '');
  return useMemo(() => parseLinkState(raw), [raw]);
}

export interface NewLinkInput {
  movieSlug: string;
  movieTitle: string;
  kind: LinkKind;
  label: string;
  quality: string;
  providerId: string;
  providerName: string;
  status: LinkStatus;
  hasValidatedDraft: boolean;
}

export function createCustomLink(input: NewLinkInput, existingKeys: string[]): DemoLink {
  let counter = 1;
  let demoKey = `draft/${input.movieSlug}/${counter}`;
  while (existingKeys.includes(demoKey)) {
    counter += 1;
    demoKey = `draft/${input.movieSlug}/${counter}`;
  }
  return {
    demoKey,
    movieSlug: input.movieSlug,
    movieTitle: input.movieTitle,
    optionSlug: 'draft',
    kind: input.kind,
    label: input.label,
    quality: input.quality,
    providerId: input.providerId,
    providerName: input.providerName,
    status: input.status,
    note: 'Isolated demo draft; it does not publish a provider link.',
    emphasized: false,
    draftOnly: true,
    hasValidatedDraft: input.hasValidatedDraft,
  };
}
