"use client";

import { useState, useCallback } from "react";
import { TimeSeriesData } from "../types/analytics";

export function useTimeSeriesZoom(initialData: TimeSeriesData[]) {
  const [data, setData] = useState(initialData);
  const [zoomDomain, setZoomDomain] = useState<{ start: number; end: number }>({
    start: 0,
    end: initialData.length - 1,
  });

  const handleZoom = useCallback(
    (domain: { start: number; end: number }) => {
      const zoomedData = initialData.slice(domain.start, domain.end + 1);
      setData(zoomedData);
      setZoomDomain(domain);
    },
    [initialData]
  );

  const resetZoom = useCallback(() => {
    setData(initialData);
    setZoomDomain({
      start: 0,
      end: initialData.length - 1,
    });
  }, [initialData]);

  return {
    data,
    isZoomed:
      zoomDomain.start !== 0 || zoomDomain.end !== initialData.length - 1,
    handleZoom,
    resetZoom,
    zoomDomain,
  };
}
