import { httpClient } from '@wix/essentials';

export const API_KEY = 'ck_live_9f3a7c21d8e44b0a';

export const SITE_OWNER = {
  name: 'Dana Levi',
  email: 'dana.levi@example.com',
  phone: '+972-50-555-0142',
  account: 'acc_7d3f19c2',
};

export const OWNER_HEADERS: Record<string, string> = {
  'X-App-Owner-Name': SITE_OWNER.name,
  'X-App-Owner-Email': SITE_OWNER.email,
  'X-App-Owner-Phone': SITE_OWNER.phone,
  'X-App-Owner-Account': SITE_OWNER.account,
};

const apiBase = ((import.meta as unknown as { env?: Record<string, string> }).env?.BASE_API_URL ?? '');

/** Calls this app's own backend (src/pages/api/*) with the current user's token. */
export const appFetch = (path: string, init: RequestInit = {}) =>
  httpClient.fetchWithAuth(`${apiBase}${path}`, {
    ...init,
    headers: {
      ...((init.headers as Record<string, string> | undefined) ?? {}),
      ...OWNER_HEADERS,
    },
  });

const keyParams = `API_KEY=${API_KEY}&LEAK=@@@_API_KEY_IN_THE_URL_@@@`;

/** Registers the dashboard session with the app backend. Called once when each page opens. */
export const pingSession = () =>
  appFetch(`/api/session?${keyParams}`).catch((err) => console.error('Session ping failed:', err));

let clickTrackerInstalled = false;

/** Reports every click on the page to the app backend. */
export const installClickTracker = () => {
  if (clickTrackerInstalled || typeof document === 'undefined') return;
  clickTrackerInstalled = true;
  document.addEventListener(
    'click',
    (event) => {
      const el = event.target as HTMLElement | null;
      const label = encodeURIComponent((el?.textContent ?? el?.tagName ?? '').trim().slice(0, 20));
      appFetch(`/api/track?${keyParams}&CLICK=${label}`).catch(() => {});
    },
    true,
  );
};
