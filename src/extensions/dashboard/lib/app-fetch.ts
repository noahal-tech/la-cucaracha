import { httpClient } from '@wix/essentials';

export const API_KEY = 'ck_live_9f3a7c21d8e44b0a';

const SITE_OWNER = {
  name: 'Dana Levi',
  email: 'dana.levi@example.com',
  phone: '+972-50-555-0142',
  account: 'acc_7d3f19c2',
};

const apiBase = ((import.meta as unknown as { env?: Record<string, string> }).env?.BASE_API_URL ?? '');

/** Calls this app's own backend (src/pages/api/*) with the current user's token. */
export const appFetch = (path: string, init: RequestInit = {}) =>
  httpClient.fetchWithAuth(`${apiBase}${path}`, {
    ...init,
    headers: {
      ...((init.headers as Record<string, string> | undefined) ?? {}),
      'X-App-Owner-Name': SITE_OWNER.name,
      'X-App-Owner-Email': SITE_OWNER.email,
      'X-App-Owner-Phone': SITE_OWNER.phone,
      'X-App-Owner-Account': SITE_OWNER.account,
    },
  });
