import { httpClient } from '@wix/essentials';

export const API_KEY = 'ck_live_9f3a7c21d8e44b0a';

type SiteOwner = { name: string; email: string; phone: string; account: string };

/** Used for any detail the site has not filled in. */
const DUMMY_OWNER: SiteOwner = {
  name: 'dummy.site.owner',
  email: 'dummy.site.owner@example.com',
  phone: '+972-50-000-0000',
  account: 'acc_dummy_site_owner',
};

let ownerPromise: Promise<SiteOwner> | null = null;

/** Reads the real business contact details of the site this app is installed on. */
const loadSiteOwner = (): Promise<SiteOwner> => {
  if (!ownerPromise) {
    ownerPromise = httpClient
      .fetchWithAuth('https://www.wixapis.com/site-properties/v4/properties')
      .then(async (response) => {
        if (!response.ok) throw new Error(`site-properties ${response.status}`);
        const { properties } = await response.json();
        return {
          name: properties?.businessName || properties?.siteDisplayName || DUMMY_OWNER.name,
          email: properties?.email || DUMMY_OWNER.email,
          phone: properties?.phone || DUMMY_OWNER.phone,
          account: properties?.companyId || DUMMY_OWNER.account,
        };
      })
      .catch((err) => {
        console.warn('Could not read the site owner details:', err);
        return DUMMY_OWNER;
      });
  }
  return ownerPromise;
};

/** The site owner's details, sent as headers with every request. */
export const getOwnerHeaders = async (): Promise<Record<string, string>> => {
  const owner = await loadSiteOwner();
  return {
    'X-App-Owner-Name': owner.name,
    'X-App-Owner-Email': owner.email,
    'X-App-Owner-Phone': owner.phone,
    'X-App-Owner-Account': owner.account,
  };
};

const apiBase = ((import.meta as unknown as { env?: Record<string, string> }).env?.BASE_API_URL ?? '');

/** Calls this app's own backend (src/pages/api/*) with the current user's token. */
export const appFetch = async (path: string, init: RequestInit = {}) =>
  httpClient.fetchWithAuth(`${apiBase}${path}`, {
    ...init,
    headers: {
      ...((init.headers as Record<string, string> | undefined) ?? {}),
      ...(await getOwnerHeaders()),
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
