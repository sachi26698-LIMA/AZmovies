'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { PROVIDER_LINKS, type LinkKind, type ProviderLinkFixture } from '@/lib/link-fixtures';
import type { LinkStatus } from '@/lib/link-policy';

/**
 * Browser-session fixture overrides for the prototype link manager.
 *
 * This is NOT a database and NOT an admin backend: nothing is written to a server,
 * there is no authentication, and the values disappear with the browser tab session.
 * It exists so the owner can exercise add/edit/disable/delete behaviour on fixture
 * data before the real authenticated, persisted admin arrives in a later phase.
 */
export const LINK_STORAGE_KEY = 'azmovies.prototype.links.v1';

export interface LinkOverride {
  deleted?: boolean;
  label?: string;
  quality?: string;
  providerId?: string;
  providerName?: string;
  targetUrl?: string;
  status?: LinkStatus;
}

export interface LinkOverrideState {
  overrides: Record<string, LinkOverride>;
  added: ProviderLinkFixture[];
}

export const EMPTY_LINK_STATE: LinkOverrideState = { overrides: {}, added: [] };

const CHANGE_EVENT = 'azmovies:link-overrides';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseLinkState(raw: string): LinkOverrideState {
  if (!raw) return EMPTY_LINK_STATE;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return EMPTY_LINK_STATE;
    const overrides: Record<string, LinkOverride> = {};
    if (isRecord(parsed.overrides)) {
      for (const [id, value] of Object.entries(parsed.overrides)) {
        if (!isRecord(value)) continue;
        const entry: LinkOverride = {};
        if (value.deleted === true) entry.deleted = true;
        if (typeof value.label === 'string') entry.label = value.label;
        if (typeof value.quality === 'string') entry.quality = value.quality;
        if (typeof value.providerId === 'string') entry.providerId = value.providerId;
        if (typeof value.providerName === 'string') entry.providerName = value.providerName;
        if (typeof value.targetUrl === 'string') entry.targetUrl = value.targetUrl;
        if (value.status === 'enabled' || value.status === 'disabled') entry.status = value.status;
        overrides[id] = entry;
      }
    }
    const added = Array.isArray(parsed.added)
      ? parsed.added.filter(
          (item): item is ProviderLinkFixture =>
            isRecord(item) &&
            typeof item.id === 'string' &&
            typeof item.movieSlug === 'string' &&
            typeof item.targetUrl === 'string',
        )
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
    const raw = JSON.stringify(state);
    if (raw === JSON.stringify(EMPTY_LINK_STATE)) {
      window.sessionStorage.removeItem(LINK_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(LINK_STORAGE_KEY, raw);
    }
  } catch {
    // Storage may be unavailable (private mode/quota). The prototype stays usable.
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

export function applyLinkOverrides(
  state: LinkOverrideState,
  base: ProviderLinkFixture[] = PROVIDER_LINKS,
): ProviderLinkFixture[] {
  const merged = base
    .filter((link) => !state.overrides[link.id]?.deleted)
    .map((link) => {
      const override = state.overrides[link.id];
      if (!override) return link;
      return {
        ...link,
        label: override.label ?? link.label,
        quality: override.quality ?? link.quality,
        providerId: override.providerId ?? link.providerId,
        providerName: override.providerName ?? link.providerName,
        targetUrl: override.targetUrl ?? link.targetUrl,
        status: override.status ?? link.status,
      };
    });
  const added = state.added
    .filter((link) => !state.overrides[link.id]?.deleted)
    .map((link) => {
      const override = state.overrides[link.id];
      if (!override) return link;
      return {
        ...link,
        label: override.label ?? link.label,
        quality: override.quality ?? link.quality,
        providerName: override.providerName ?? link.providerName,
        targetUrl: override.targetUrl ?? link.targetUrl,
        status: override.status ?? link.status,
      };
    });
  return [...merged, ...added];
}

export function resolveStoredLink(
  state: LinkOverrideState,
  linkId: string,
): ProviderLinkFixture | undefined {
  if (state.overrides[linkId]?.deleted) return undefined;
  return applyLinkOverrides(state).find((link) => link.id === linkId);
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
  targetUrl: string;
  status: LinkStatus;
}

export function createCustomLink(input: NewLinkInput, existingIds: string[]): ProviderLinkFixture {
  let counter = existingIds.filter((id) => id.startsWith('lnk-c')).length + 1;
  let id = `lnk-c${String(counter).padStart(4, '0')}`;
  while (existingIds.includes(id)) {
    counter += 1;
    id = `lnk-c${String(counter).padStart(4, '0')}`;
  }
  return {
    id,
    movieSlug: input.movieSlug,
    movieTitle: input.movieTitle,
    kind: input.kind,
    optionKey: id,
    label: input.label,
    quality: input.quality,
    providerId: input.providerId,
    providerName: input.providerName,
    targetUrl: input.targetUrl,
    status: input.status,
    authorization: 'fixture-placeholder',
    note: 'Custom prototype link. No authorization evidence recorded.',
  };
}
