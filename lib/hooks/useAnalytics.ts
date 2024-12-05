"use client";

import { useState, useEffect } from "react";
import { AnalyticsData, FilterState } from "../types/analytics";
import { startOfDay, endOfDay } from "date-fns";
import { useUrlParams } from "./useUrlParams";

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [filteredData, setFilteredData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getFiltersFromUrl } = useUrlParams();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Apply initial filters from URL when data is loaded
    if (data.length > 0) {
      const urlFilters = getFiltersFromUrl();
      applyFilters(urlFilters);
    }
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/analytics");
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setData(result);
      setFilteredData(result);
      setError(null);
    } catch (err) {
      setError("Failed to load analytics data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (filters: FilterState) => {
    let filtered = [...data];

    // Apply date range filter
    if (filters.dateRange.from && filters.dateRange.to) {
      const fromDate = startOfDay(filters.dateRange.from);
      const toDate = endOfDay(filters.dateRange.to);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    // Apply age group filter
    if (filters.ageGroup.length > 0) {
      filtered = filtered.filter((item) => filters.ageGroup.includes(item.age));
    }

    // Apply gender filter
    if (filters.gender.length > 0) {
      filtered = filtered.filter((item) =>
        filters.gender.includes(item.gender)
      );
    }

    setFilteredData(filtered);
  };

  return {
    data: filteredData,
    loading,
    error,
    applyFilters,
  };
}
