'use client';

import { ErrorCatalog } from '@/components/movies/CatalogStates';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <ErrorCatalog onRetry={reset} />;
}
