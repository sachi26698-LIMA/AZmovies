import { intermediatePath } from '@/lib/link-catalog';
import { getLinkForOption } from '@/lib/link-fixtures';
import { resolveContinue, type DenialReason } from '@/lib/link-policy';
import { EXTERNAL_ACTIVATION_ENABLED } from '@/lib/redirect-config';

/**
 * The public path identifies a movie and option, not an internal record ID.
 * Only the server fixture inventory supplies the destination. Request query
 * parameters, headers, cookies and bodies are never used as a target.
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

export async function GET(
  _request: Request,
  context: { params: Promise<{ movieSlug: string; optionSlug: string }> },
) {
  const { movieSlug, optionSlug } = await context.params;
  const link = getLinkForOption(movieSlug, optionSlug);
  const decision = resolveContinue(link, { activationEnabled: EXTERNAL_ACTIVATION_ENABLED });

  if (decision.action === 'redirect') {
    return new Response(null, {
      status: 303,
      headers: { ...sharedHeaders, Location: decision.url },
    });
  }

  // The back link is constructed only from a trusted matched fixture, not the request.
  const backHref = link ? intermediatePath(link.movieSlug, link.optionSlug) : '/';
  return denialPage(decision.message, backHref, denialStatus[decision.reason]);
}
