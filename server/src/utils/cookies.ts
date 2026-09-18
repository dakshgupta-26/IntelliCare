import { Response } from 'express';
import { config } from '../config/env';

export const COOKIE_NAME = 'ic_refresh_token';

export const setRefreshCookie = (res: Response, rawRefreshToken: string) => {
  res.cookie(COOKIE_NAME, rawRefreshToken, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    domain: config.cookieDomain,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    domain: config.cookieDomain,
    path: '/'
  });
};
