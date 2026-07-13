// Central route path constants — import these instead of hardcoding strings
// so renaming a route only requires a change in one place.
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SEARCH: '/search',
  RESULT_DETAILS: '/result/:type/:value',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_UPLOAD: '/admin/upload',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
  NOT_FOUND: '*',
};

export const resultDetailsPath = (type, value) => `/result/${type}/${encodeURIComponent(value)}`;
