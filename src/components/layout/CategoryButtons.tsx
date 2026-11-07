import { CATEGORY_ROWS, SPECIAL_BUTTONS } from '@/lib/fixtures';
import styles from '@/styles/prototype.module.css';

interface CategoryButtonsProps {
  activeCategory: string | null;
  onSelect: (category: string) => void;
}

const toneClass: Record<string, string> = {
  green: styles.categoryGreen ?? '',
  'red-top': styles.categoryRedTop ?? '',
  blue: styles.categoryBlue ?? '',
  orange: styles.categoryOrange ?? '',
};

export function CategoryButtons({ activeCategory, onSelect }: CategoryButtonsProps) {
  return (
    <nav className={styles.categories} aria-label="Movie categories">
      <div className={styles.categorySpecialGrid}>
        {SPECIAL_BUTTONS.map((button) =>
          button.kind === 'inactive' ? (
            <button
              key={button.label}
              type="button"
              className={`${styles.categoryButton} ${toneClass[button.tone] ?? ''}`}
              aria-disabled="true"
              title="Static prototype only; no external destination is configured"
            >
              {button.label}
            </button>
          ) : (
            <button
              key={button.label}
              type="button"
              className={`${styles.categoryButton} ${toneClass[button.tone] ?? ''}`}
              aria-pressed={activeCategory === button.label}
              onClick={() => onSelect(button.label)}
            >
              {button.label}
            </button>
          ),
        )}
      </div>
      <div className={styles.categoryRows}>
        {CATEGORY_ROWS.map((row, rowIndex) => (
          <div className={styles.categoryRow} key={rowIndex}>
            {row.map((label) => (
              <button
                key={label}
                type="button"
                className={`${styles.categoryButton} ${styles.categoryRed}`}
                aria-pressed={activeCategory === label}
                onClick={() => onSelect(label)}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
