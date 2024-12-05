export const COOKIE_KEYS = {
  FILTERS: "dashboard_filters",
  DATE_RANGE: "dashboard_date_range",
} as const;

export const COOKIE_OPTIONS = {
  expires: 30, // 30 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
} as const;
