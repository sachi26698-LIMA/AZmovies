import { ChevronRightIcon } from '@/components/Icons';
import styles from '@/styles/prototype.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function paginationItems(
  currentPage: number,
  totalPages: number,
): Array<number | 'ellipsis'> {
  if (totalPages <= 1) return [];
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 3) return [1, 2, 3, 'ellipsis', totalPages];
  if (currentPage >= totalPages - 2)
    return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages];
  return [1, 'ellipsis', currentPage, 'ellipsis', totalPages];
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const items = paginationItems(currentPage, totalPages);
  if (items.length === 0) return null;

  return (
    <nav className={styles.pagination} aria-label="Catalog pagination">
      <ul className={styles.paginationList}>
        {currentPage > 1 && (
          <li>
            <button
              type="button"
              className={styles.paginationButton}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>
        )}
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} className={styles.paginationItem}>
              <span className={styles.paginationEllipsis} aria-hidden="true">
                ...
              </span>
            </li>
          ) : (
            <li key={item} className={styles.paginationItem}>
              <button
                type="button"
                className={`${styles.paginationButton} ${item === currentPage ? styles.paginationActive : ''}`}
                aria-current={item === currentPage ? 'page' : undefined}
                aria-label={`Page ${item}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
        {currentPage < totalPages && (
          <li className={styles.paginationNextItem}>
            <button
              type="button"
              className={styles.paginationButton}
              aria-label="Next page"
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next <ChevronRightIcon size={18} />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
