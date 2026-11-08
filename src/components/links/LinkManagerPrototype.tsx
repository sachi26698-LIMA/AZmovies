'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SideDrawer } from '@/components/layout/SideDrawer';
import { MOVIES } from '@/lib/fixtures';
import { PROVIDERS, getPublicLinksForMovie, intermediatePath } from '@/lib/link-catalog';
import {
  EMPTY_LINK_STATE,
  applyLinkOverrides,
  createCustomLink,
  useLinkState,
  writeLinkState,
  type DemoLink,
  type LinkOverride,
  type LinkOverrideState,
} from '@/lib/link-store';
import { validateDestinationUrl } from '@/lib/link-policy';
import styles from '@/styles/link-pages.module.css';

interface LinkFormValues {
  label: string;
  quality: string;
  providerId: string;
  targetUrl: string;
  status: 'enabled' | 'disabled';
}

interface LinkFormProps {
  idPrefix: string;
  heading: string;
  initial: LinkFormValues;
  submitLabel: string;
  onSubmit: (values: LinkFormValues) => void;
  onCancel?: () => void;
  requireDestination?: boolean;
}

function LinkForm({
  idPrefix,
  heading,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  requireDestination = false,
}: LinkFormProps) {
  const [values, setValues] = useState<LinkFormValues>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof LinkFormValues, string>>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof LinkFormValues, string>> = {};
    if (!values.label.trim()) nextErrors.label = 'Enter a truthful link label.';
    if (!values.quality.trim()) nextErrors.quality = 'Enter the quality or option name.';
    const hasDestination = values.targetUrl.trim().length > 0;
    const validation = hasDestination ? validateDestinationUrl(values.targetUrl) : null;
    if (requireDestination && !hasDestination)
      nextErrors.targetUrl = 'Enter a test destination URL.';
    if (validation && !validation.ok) nextErrors.targetUrl = validation.message;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit({
      ...values,
      label: values.label.trim(),
      quality: values.quality.trim(),
      targetUrl: validation?.ok ? validation.url : '',
    });
    // The URL is only a form-validation example, never a stored destination.
    setValues({ ...initial, targetUrl: '' });
  }

  return (
    <form className={styles.panel} onSubmit={handleSubmit} aria-label={heading}>
      <h3 className={styles.panelTitle}>{heading}</h3>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor={`${idPrefix}-label`}>
            Link label
          </label>
          <input
            id={`${idPrefix}-label`}
            className={styles.input}
            value={values.label}
            maxLength={120}
            aria-invalid={errors.label ? 'true' : undefined}
            aria-describedby={errors.label ? `${idPrefix}-label-error` : undefined}
            onChange={(event) => setValues({ ...values, label: event.target.value })}
          />
          {errors.label ? (
            <p className={styles.error} id={`${idPrefix}-label-error`} role="alert">
              {errors.label}
            </p>
          ) : null}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor={`${idPrefix}-quality`}>
            Quality / option
          </label>
          <input
            id={`${idPrefix}-quality`}
            className={styles.input}
            value={values.quality}
            maxLength={60}
            aria-invalid={errors.quality ? 'true' : undefined}
            aria-describedby={errors.quality ? `${idPrefix}-quality-error` : undefined}
            onChange={(event) => setValues({ ...values, quality: event.target.value })}
          />
          {errors.quality ? (
            <p className={styles.error} id={`${idPrefix}-quality-error`} role="alert">
              {errors.quality}
            </p>
          ) : null}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor={`${idPrefix}-provider`}>
            Fixture provider
          </label>
          <select
            id={`${idPrefix}-provider`}
            className={styles.select}
            value={values.providerId}
            onChange={(event) => setValues({ ...values, providerId: event.target.value })}
          >
            {PROVIDERS.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor={`${idPrefix}-status`}>
            Status
          </label>
          <select
            id={`${idPrefix}-status`}
            className={styles.select}
            value={values.status}
            onChange={(event) =>
              setValues({ ...values, status: event.target.value as LinkFormValues['status'] })
            }
          >
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor={`${idPrefix}-url`}>
          Test destination URL (approved HTTPS hosts only)
        </label>
        <input
          id={`${idPrefix}-url`}
          className={styles.input}
          value={values.targetUrl}
          inputMode="url"
          maxLength={2048}
          aria-invalid={errors.targetUrl ? 'true' : undefined}
          aria-describedby={errors.targetUrl ? `${idPrefix}-url-error` : `${idPrefix}-url-note`}
          onChange={(event) => setValues({ ...values, targetUrl: event.target.value })}
        />
        <p className={styles.linkMeta} id={`${idPrefix}-url-note`}>
          Validated for this demo, then discarded. It never changes a server destination.
        </p>
        {errors.targetUrl ? (
          <p className={styles.error} id={`${idPrefix}-url-error`} role="alert">
            {errors.targetUrl}
          </p>
        ) : null}
      </div>
      <div className={styles.rowActions} style={{ marginTop: 12 }}>
        <button type="submit" className={styles.primaryButton}>
          {submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className={styles.smallButton} onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

function withOverride(
  state: LinkOverrideState,
  demoKey: string,
  patch: LinkOverride,
): LinkOverrideState {
  return {
    ...state,
    overrides: { ...state.overrides, [demoKey]: { ...state.overrides[demoKey], ...patch } },
  };
}

export function LinkManagerPrototype() {
  const router = useRouter();
  const state = useLinkState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [movieSlug, setMovieSlug] = useState(MOVIES[0]?.slug ?? '');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const allLinks = applyLinkOverrides(state);
  const movie = MOVIES.find((item) => item.slug === movieSlug);
  const links = allLinks.filter((link) => link.movieSlug === movieSlug);
  const fixtureCount = getPublicLinksForMovie(movieSlug).length;

  function providerName(id: string): string {
    return PROVIDERS.find((provider) => provider.id === id)?.name ?? id;
  }

  function handleAdd(values: LinkFormValues) {
    if (!movie) return;
    const link = createCustomLink(
      {
        movieSlug: movie.slug,
        movieTitle: movie.title,
        kind: 'provider',
        label: values.label,
        quality: values.quality,
        providerId: values.providerId,
        providerName: providerName(values.providerId),
        status: values.status,
        hasValidatedDraft: true,
      },
      allLinks.map((item) => item.demoKey),
    );
    writeLinkState({ ...state, added: [...state.added, link] });
    setMessage(`Added a demo option for ${movie.title}.`);
  }

  function handleEdit(demoKey: string, values: LinkFormValues) {
    writeLinkState(
      withOverride(state, demoKey, {
        label: values.label,
        quality: values.quality,
        providerId: values.providerId,
        providerName: providerName(values.providerId),
        status: values.status,
        ...(values.targetUrl ? { hasValidatedDraft: true } : {}),
      }),
    );
    setEditingKey(null);
    setMessage('Updated the demo option.');
  }

  function handleToggle(link: DemoLink) {
    const status = link.status === 'enabled' ? 'disabled' : 'enabled';
    writeLinkState(withOverride(state, link.demoKey, { status }));
    setMessage(`Demo option is now ${status}.`);
  }

  function handleDelete(link: DemoLink) {
    writeLinkState(withOverride(state, link.demoKey, { deleted: true }));
    setEditingKey(null);
    setMessage('Deleted the option from this demo session.');
  }

  return (
    <>
      <Header
        onOpenMenu={() => setDrawerOpen(true)}
        onSearchClick={() => setDrawerOpen(true)}
        menuExpanded={drawerOpen}
      />
      <main id="main-content" className={styles.main}>
        <p className={styles.eyebrow}>AZmovies · Prototype link manager</p>
        <h1 className={styles.title}>Provider link configuration</h1>
        <p className={styles.adminBanner}>
          <strong>Isolated demo only.</strong> Changes stay in this browser tab and do not change
          the public pages or server mappings. There is no authentication, no server write and no
          database. Test URLs are validated and discarded, and no real destination can be activated.
          Authenticated, persisted link management is a later phase.
        </p>

        <div className={styles.toolbarRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="admin-movie">
              Movie
            </label>
            <select
              id="admin-movie"
              className={styles.select}
              value={movieSlug}
              onChange={(event) => {
                setMovieSlug(event.target.value);
                setEditingKey(null);
              }}
            >
              {MOVIES.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className={styles.smallButton}
            onClick={() => {
              writeLinkState(EMPTY_LINK_STATE);
              setEditingKey(null);
              setMessage('All demo overrides cleared. Fixture options restored.');
            }}
          >
            Reset to fixtures
          </button>
          <Link className={styles.smallButton} href={movie ? `/movies/${movie.slug}/` : '/'}>
            Open movie detail
          </Link>
        </div>

        <p className={styles.linkMeta}>
          {links.length} demo options for this movie ({fixtureCount} original fixtures;{' '}
          {links.filter((link) => link.draftOnly).length} session drafts). Changes are isolated from
          the public catalog.
        </p>
        <p className={styles.statusMessage} role="status" aria-live="polite">
          {message}
        </p>

        <section aria-label="Provider links">
          <h2 className={styles.panelTitle}>Individual links</h2>
          <ul className={styles.linkList}>
            {links.map((link) => (
              <li key={link.demoKey} className={styles.linkRow}>
                <div className={styles.linkRowHead}>
                  <h3 className={styles.linkRowTitle}>{link.label}</h3>
                  <span
                    className={
                      link.status === 'enabled'
                        ? styles.badge
                        : `${styles.badge} ${styles.badgeDisabled}`
                    }
                  >
                    {link.status === 'enabled' ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className={styles.linkMeta}>
                  {link.quality} · {link.providerName}
                  <br />
                  {link.draftOnly ? 'Session draft only' : 'Fixture demo; server mapping unchanged'}
                </p>
                <div className={styles.rowActions}>
                  {link.draftOnly ? (
                    <span className={styles.linkMeta}>Draft only; no public page</span>
                  ) : (
                    <Link
                      className={styles.smallButton}
                      href={intermediatePath(link.movieSlug, link.optionSlug)}
                    >
                      Open intermediate page
                    </Link>
                  )}
                  <button
                    type="button"
                    className={styles.smallButton}
                    onClick={() => setEditingKey(editingKey === link.demoKey ? null : link.demoKey)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.smallButton}
                    onClick={() => handleToggle(link)}
                  >
                    {link.status === 'enabled' ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    className={styles.smallButton}
                    onClick={() => handleDelete(link)}
                  >
                    Delete
                  </button>
                </div>
                {editingKey === link.demoKey ? (
                  <LinkForm
                    key={link.demoKey}
                    idPrefix="edit-link"
                    heading="Edit demo option"
                    submitLabel="Save link"
                    initial={{
                      label: link.label,
                      quality: link.quality,
                      providerId: link.providerId,
                      targetUrl: '',
                      status: link.status,
                    }}
                    onSubmit={(values) => handleEdit(link.demoKey, values)}
                    onCancel={() => setEditingKey(null)}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <LinkForm
          key={`add-${movieSlug}`}
          idPrefix="add"
          heading="Add a provider link"
          submitLabel="Add link"
          requireDestination
          initial={{
            label: '',
            quality: '',
            providerId: PROVIDERS[0]?.id ?? 'alpha',
            targetUrl: '',
            status: 'enabled',
          }}
          onSubmit={handleAdd}
        />
      </main>
      <Footer />
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSearch={(query) =>
          router.push(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : '/')
        }
        onNavigate={(label) =>
          router.push(label === 'AZmovies Home' ? '/' : `/?q=${encodeURIComponent(label)}`)
        }
      />
    </>
  );
}
