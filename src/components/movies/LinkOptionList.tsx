'use client';

import Link from 'next/link';
import type { LinkPlaceholder } from '@/lib/detail-fixtures';
import { intermediatePath } from '@/lib/link-fixtures';
import { resolveStoredLink, useLinkState } from '@/lib/link-store';
import styles from '@/styles/detail.module.css';

interface LinkOptionListProps {
  label: string;
  options: LinkPlaceholder[];
  tone?: 'blue' | 'teal';
}

/**
 * Approved detail-page styling is unchanged. The only behaviour change is that an
 * enabled option now opens its own AZmovies intermediate page (Page 3) instead of
 * being a dead placeholder. No option ever links to an external destination.
 */
export function LinkOptionList({ label, options, tone = 'blue' }: LinkOptionListProps) {
  const state = useLinkState();
  const className = tone === 'teal' ? styles.optionLinkTeal : styles.optionLink;

  return (
    <ul className={styles.optionList} aria-label={label}>
      {options.map((option) => {
        const stored = option.linkId ? resolveStoredLink(state, option.linkId) : undefined;
        const removed = Boolean(option.linkId) && !stored;
        const disabled = removed || stored?.status === 'disabled';
        const note = removed
          ? 'This link was removed in the prototype link manager.'
          : stored?.status === 'disabled'
            ? 'This link is disabled by the administrator.'
            : option.note;

        return (
          <li key={option.id} className={styles.optionItem}>
            {option.linkId && !disabled ? (
              <Link
                className={className}
                href={intermediatePath(option.linkId)}
                data-link-id={option.linkId}
              >
                {stored?.label ?? option.label}
              </Link>
            ) : (
              <button
                type="button"
                className={className}
                aria-disabled="true"
                title={note}
                data-link-id={option.linkId ?? undefined}
              >
                {stored?.label ?? option.label}
              </button>
            )}
            <span className="visually-hidden">{note}</span>
          </li>
        );
      })}
    </ul>
  );
}
