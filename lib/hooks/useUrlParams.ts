"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterState } from "../types/analytics";
import { parse, format } from "date-fns";

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getFiltersFromUrl = (): FilterState => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const ageGroup = searchParams.getAll("age");
    const gender = searchParams.getAll("gender");

    return {
      dateRange: {
        from: from ? parse(from, "yyyy-MM-dd", new Date()) : undefined,
        to: to ? parse(to, "yyyy-MM-dd", new Date()) : undefined,
      },
      ageGroup,
      gender,
    };
  };

  const updateUrl = (filters: FilterState, replace: boolean = true) => {
    const params = new URLSearchParams();

    if (filters.dateRange.from) {
      params.set("from", format(filters.dateRange.from, "yyyy-MM-dd"));
    }
    if (filters.dateRange.to) {
      params.set("to", format(filters.dateRange.to, "yyyy-MM-dd"));
    }

    filters.ageGroup.forEach((age) => params.append("age", age));
    filters.gender.forEach((gender) => params.append("gender", gender));

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    if (replace) {
      router.replace(url);
    } else {
      router.push(url);
    }
  };

  const hasUrlParams = () => {
    return searchParams.toString().length > 0;
  };

  return {
    getFiltersFromUrl,
    updateUrl,
    hasUrlParams,
  };
}
