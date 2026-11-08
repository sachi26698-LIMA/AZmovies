import Image from 'next/image';
import type { ScreenshotFixture } from '@/lib/detail-fixtures';
import styles from '@/styles/detail.module.css';

interface ScreenshotGalleryProps {
  screenshots: ScreenshotFixture[];
}

export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  return (
    <div className={styles.gallery} role="region" aria-label="Movie screenshot gallery">
      {screenshots.map((shot) => (
        <Image
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          width={960}
          height={540}
          sizes="(min-width: 768px) 680px, 92vw"
          className={styles.galleryImage}
          loading="lazy"
        />
      ))}
    </div>
  );
}
