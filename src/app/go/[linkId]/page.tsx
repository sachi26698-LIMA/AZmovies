import type { Metadata } from 'next';
import { IntermediateLinkPrototype } from '@/components/links/IntermediateLinkPrototype';
import { PROVIDER_LINKS, getLinkById } from '@/lib/link-fixtures';
import { isSafeLinkId } from '@/lib/link-policy';

export const metadata: Metadata = {
  title: 'AZmovies — Continue to authorized provider',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return PROVIDER_LINKS.map((link) => ({ linkId: link.id }));
}

export default async function IntermediateLinkPage({
  params,
}: {
  params: Promise<{ linkId: string }>;
}) {
  const { linkId } = await params;
  // The id is the only input. Unknown/unsafe ids render a safe "not available"
  // panel inside the component; no destination is read from the request.
  const known = isSafeLinkId(linkId) ? getLinkById(linkId) : undefined;
  return <IntermediateLinkPrototype linkId={known?.id ?? linkId} />;
}
