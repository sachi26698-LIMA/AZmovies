import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  IntermediateLinkPrototype,
  type HandoffSummary,
} from '@/components/links/IntermediateLinkPrototype';
import { continuePath, PUBLIC_LINKS } from '@/lib/link-catalog';
import { getLinkForOption } from '@/lib/link-fixtures';
import { resolveContinue } from '@/lib/link-policy';
import { EXTERNAL_ACTIVATION_ENABLED } from '@/lib/redirect-config';

export const metadata: Metadata = {
  title: 'AZmovies — Continue to provider',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return PUBLIC_LINKS.map(({ movieSlug, optionSlug }) => ({ movieSlug, optionSlug }));
}

export default async function IntermediateLinkPage({
  params,
}: {
  params: Promise<{ movieSlug: string; optionSlug: string }>;
}) {
  const { movieSlug, optionSlug } = await params;
  const link = getLinkForOption(movieSlug, optionSlug);
  if (!link) notFound();

  // Construct an explicit safe view model. Never serialize the server record,
  // internal link ID, authorization data or destination URL into page props.
  const decision = resolveContinue(link, { activationEnabled: EXTERNAL_ACTIVATION_ENABLED });
  const selection: HandoffSummary = {
    movieSlug: link.movieSlug,
    movieTitle: link.movieTitle,
    quality: link.quality,
    providerName: link.providerName,
    continueHref: continuePath(link.movieSlug, link.optionSlug),
    canContinue: decision.action === 'redirect',
    continueMessage:
      decision.action === 'redirect'
        ? 'Continue to the selected provider.'
        : decision.reason === 'link-disabled'
          ? 'This option is currently unavailable.'
          : 'External destinations are disabled in this prototype.',
  };

  return <IntermediateLinkPrototype selection={selection} />;
}
