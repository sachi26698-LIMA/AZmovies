import { Suspense } from 'react';
import { PrototypeHome, PrototypeHomeContent } from '@/components/PrototypeHome';

export default function HomePage() {
  return (
    <Suspense fallback={<PrototypeHomeContent initialQuery="" />}>
      <PrototypeHome />
    </Suspense>
  );
}
