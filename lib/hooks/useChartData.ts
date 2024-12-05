"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { AnalyticsData, ChartData, TimeSeriesData } from "../types/analytics";

export function useChartData(data: AnalyticsData[]) {
  const featureData = useMemo(() => {
    const featureMap = new Map<string, number>();

    data.forEach((item) => {
      const current = featureMap.get(item.feature) || 0;
      featureMap.set(item.feature, current + item.timeSpent);
    });

    return Array.from(featureMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const getTimeSeriesData = (feature: string): TimeSeriesData[] => {
    const timeMap = new Map<string, number>();
    data
      .filter((item) => item.feature === feature)
      .forEach((item) => {
        const dateStr = format(new Date(item.date), "dd/MM/yyyy");
        const current = timeMap.get(dateStr) || 0;

        timeMap.set(dateStr, current + item.timeSpent);
      });
    return Array.from(timeMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return {
    featureData,
    getTimeSeriesData,
  };
}
