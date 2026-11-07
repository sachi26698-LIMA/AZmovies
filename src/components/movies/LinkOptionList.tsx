import type { LinkPlaceholder } from '@/lib/detail-fixtures';
import styles from '@/styles/detail.module.css';

interface LinkOptionListProps {
  label: string;
  options: LinkPlaceholder[];
  tone?: 'blue' | 'teal';
}

export function LinkOptionList({ label, options, tone = 'blue' }: LinkOptionListProps) {
  return (
    <ul className={styles.optionList} aria-label={label}>
      {options.map((option) => (
        <li key={option.id} className={styles.optionItem}>
          {option.href ? (
            <a
              className={tone === 'teal' ? styles.optionLinkTeal : styles.optionLink}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {option.label}
            </a>
          ) : (
            <button
              type="button"
              className={tone === 'teal' ? styles.optionLinkTeal : styles.optionLink}
              aria-disabled="true"
              title={option.note}
            >
              {option.label}
            </button>
          )}
          <span className="visually-hidden">{option.note}</span>
        </li>
      ))}
    </ul>
  );
}
