import { getLinkById } from '@/lib/link-fixtures';
import { isSafeLinkId, resolveContinue, type DenialReason } from '@/lib/link-policy';
import { EXTERNAL_ACTIVATION_ENABLED } from '@/lib/redirect-config';

/**
 * Continue endpoint for the intermediate page.
 *
 * The target is resolved only from the stored link record identified by the opaque
 * path id. Query parameters, headers, cookies and request bodies are never read as a
 * destination, so this route cannot be used as an open redirect.
 *
 * While EXTERNAL_ACTIVATION_ENABLED is false (prototype default, owner approval
 * required) every request is denied with a safe page and no Location header.
 */
export const dynamic = 'force-dynamic';

const denialStatus: Record<DenialReason, number> = {
  'not-found': 404,
  'invalid-id': 404,
  'link-disabled': 410,
  'unsafe-destination': 403,
  'activation-disabled': 403,
  'not-authorized': 403,
};

const sharedHeaders: Record<string, string> = {
  'Cache-Control': 'no-store, max-age=0',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
};

function denialPage(message: string, backHref: string, status: number): Response {
  const body = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>AZmovies — link not opened</title></head>
<body style="margin:0;padding:24px;background:#000;color:#fff;font-family:system-ui,sans-serif">
<main style="max-width:640px;margin:0 auto">
<h1 style="font-size:22px">This link was not opened</h1>
<p style="color:#c3c3c3;line-height:1.6">${message}</p>
<p><a href="${backHref}" style="color:#0084eb">Back to AZmovies</a></p>
</main></body></html>`;
  return new Response(body, {
    status,
    headers: { ...sharedHeaders, 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function GET(_request: Request, context: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await context.params;
  const link = isSafeLinkId(linkId) ? getLinkById(linkId) : undefined;
  const decision = resolveContinue(link, { activationEnabled: EXTERNAL_ACTIVATION_ENABLED });

  if (decision.action === 'redirect') {
    return new Response(null, {
      status: 303,
      headers: { ...sharedHeaders, Location: decision.url },
    });
  }

  const backHref = link ? `/go/${link.id}/` : '/';
  return denialPage(decision.message, backHref, denialStatus[decision.reason]);
}
