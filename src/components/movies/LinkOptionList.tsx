import Link from 'next/link';
import type { LinkPlaceholder } from '@/lib/detail-fixtures';
import styles from '@/styles/detail.module.css';

interface LinkOptionListProps {
  label: string;
  options: LinkPlaceholder[];
  tone?: 'blue' | 'teal';
}

/** Public options carry descriptive local paths only, never a destination or internal link ID. */
export function LinkOptionList({ label, options, tone = 'blue' }: LinkOptionListProps) {
  const baseClass = tone === 'teal' ? styles.optionLinkTeal : styles.optionLink;

  return (
    <ul className={styles.optionList} aria-label={label}>
      {options.map((option) => {
        const className = `${baseClass} ${option.emphasized ? styles.optionEmphasis : ''}`;
        const labelContent = (
          <>
            {option.label} <span className={styles.optionTag}>[fixture]</span>
          </>
        );
        return (
          <li key={option.optionSlug} className={styles.optionItem}>
            {option.href && !option.disabled ? (
              <Link className={className} href={option.href}>
                {labelContent}
              </Link>
            ) : (
              <button type="button" className={className} disabled title={option.note}>
                {labelContent}
              </button>
            )}
            <span className="visually-hidden">{option.note}</span>
          </li>
        );
      })}
    </ul>
  );
}
