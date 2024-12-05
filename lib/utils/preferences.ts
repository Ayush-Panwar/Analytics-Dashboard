import { FilterState } from "../types/analytics";
import { getCookie, setCookie, removeCookie } from "./cookies";
import { COOKIE_KEYS, COOKIE_OPTIONS } from "../constants/cookies";
import { parse, format } from "date-fns";

export function saveFilterPreferences(filters: FilterState): void {
  const serializedFilters = {
    ageGroup: filters.ageGroup,
    gender: filters.gender,
  };

  setCookie(
    COOKIE_KEYS.FILTERS,
    JSON.stringify(serializedFilters),
    COOKIE_OPTIONS
  );

  if (filters.dateRange.from && filters.dateRange.to) {
    const dateRange = {
      from: format(filters.dateRange.from, "yyyy-MM-dd"),
      to: format(filters.dateRange.to, "yyyy-MM-dd"),
    };
    setCookie(
      COOKIE_KEYS.DATE_RANGE,
      JSON.stringify(dateRange),
      COOKIE_OPTIONS
    );
  }
}

export function loadFilterPreferences(): Partial<FilterState> {
  const filtersCookie = getCookie(COOKIE_KEYS.FILTERS);
  const dateRangeCookie = getCookie(COOKIE_KEYS.DATE_RANGE);

  const filters: Partial<FilterState> = {
    ageGroup: [],
    gender: [],
    dateRange: {
      from: undefined,
      to: undefined,
    },
  };

  if (filtersCookie) {
    try {
      const savedFilters = JSON.parse(filtersCookie);
      filters.ageGroup = savedFilters.ageGroup;
      filters.gender = savedFilters.gender;
    } catch (error) {
      console.error("Error parsing filters cookie:", error);
    }
  }

  if (dateRangeCookie) {
    try {
      const savedDateRange = JSON.parse(dateRangeCookie);
      filters.dateRange = {
        from: parse(savedDateRange.from, "yyyy-MM-dd", new Date()),
        to: parse(savedDateRange.to, "yyyy-MM-dd", new Date()),
      };
    } catch (error) {
      console.error("Error parsing date range cookie:", error);
    }
  }

  return filters;
}

export function clearFilterPreferences(): void {
  removeCookie(COOKIE_KEYS.FILTERS);
  removeCookie(COOKIE_KEYS.DATE_RANGE);
}
