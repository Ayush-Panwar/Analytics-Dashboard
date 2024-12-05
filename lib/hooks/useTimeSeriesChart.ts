"use client";

import { useState, useEffect } from "react";
import { TimeSeriesData } from "../types/analytics";

export function useTimeSeriesChart(initialData: TimeSeriesData[]) {
  const [data, setData] = useState<TimeSeriesData[]>(initialData);
  const [zoomDomain, setZoomDomain] = useState({
    start: 0,
    end: initialData.length - 1,
  });

  useEffect(() => {
    setData(initialData);
    setZoomDomain({
      start: 0,
      end: initialData.length - 1,
    });
  }, [initialData]);

  const handleZoom = (domain: { start: number; end: number }) => {
    setZoomDomain(domain);
  };

  const handleZoomIn = () => {
    setZoomDomain((prev) => {
      const currentRange = prev.end - prev.start;
      const newRange = Math.max(Math.floor(currentRange / 2), 2);
      const center = Math.floor((prev.start + prev.end) / 2);
      const halfRange = Math.floor(newRange / 2);

      return {
        start: Math.max(0, center - halfRange),
        end: Math.min(data.length - 1, center + halfRange),
      };
    });
  };

  const handleZoomOut = () => {
    setZoomDomain((prev) => {
      const currentRange = prev.end - prev.start;
      const newRange = Math.min(currentRange * 2, data.length - 1);
      const center = Math.floor((prev.start + prev.end) / 2);
      const halfRange = Math.floor(newRange / 2);

      return {
        start: Math.max(0, center - halfRange),
        end: Math.min(data.length - 1, center + halfRange),
      };
    });
  };

  const handlePan = (direction: "left" | "right") => {
    setZoomDomain((prev) => {
      const range = prev.end - prev.start;
      const shift = Math.max(1, Math.floor(range * 0.25));

      if (direction === "left") {
        const newStart = Math.max(0, prev.start - shift);
        return {
          start: newStart,
          end: Math.min(data.length - 1, newStart + range),
        };
      }

      const newEnd = Math.min(data.length - 1, prev.end + shift);
      return {
        start: Math.max(0, newEnd - range),
        end: newEnd,
      };
    });
  };

  const resetZoom = () => {
    setZoomDomain({
      start: 0,
      end: data.length - 1,
    });
  };

  return {
    data: data.slice(zoomDomain.start, zoomDomain.end + 1),
    isZoomed: zoomDomain.start !== 0 || zoomDomain.end !== data.length - 1,
    handleZoom,
    handleZoomIn,
    handleZoomOut,
    handlePan,
    resetZoom,
  };
}
