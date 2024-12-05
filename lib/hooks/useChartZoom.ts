"use client";

import { useState, useCallback } from "react";
import { TimeSeriesData } from "../types/analytics";

interface ZoomState {
  startIndex: number;
  endIndex: number;
  scale: number;
  centerIndex: number | null;
}

export function useChartZoom(data: TimeSeriesData[]) {
  const [zoomState, setZoomState] = useState<ZoomState>({
    startIndex: 0,
    endIndex: data.length - 1,
    scale: 1,
    centerIndex: null,
  });

  const zoomedData = data.slice(zoomState.startIndex, zoomState.endIndex + 1);

  const handlePointZoom = useCallback(
    (index: number, zoomIn: boolean) => {
      setZoomState((prev) => {
        const currentRange = prev.endIndex - prev.startIndex;
        const newRange = zoomIn
          ? Math.max(Math.floor(currentRange / 2), 2)
          : Math.min(currentRange * 2, data.length - 1);

        const halfRange = Math.floor(newRange / 2);
        const adjustedIndex = index + prev.startIndex; // Convert to global index

        const newStart = Math.max(0, adjustedIndex - halfRange);
        const newEnd = Math.min(data.length - 1, adjustedIndex + halfRange);

        // Adjust start/end to maintain the range size
        if (newEnd - newStart < newRange) {
          if (newStart === 0) {
            return {
              startIndex: 0,
              endIndex: Math.min(newRange, data.length - 1),
              scale: zoomIn ? prev.scale * 2 : Math.max(1, prev.scale / 2),
              centerIndex: adjustedIndex,
            };
          } else {
            return {
              startIndex: Math.max(0, data.length - 1 - newRange),
              endIndex: data.length - 1,
              scale: zoomIn ? prev.scale * 2 : Math.max(1, prev.scale / 2),
              centerIndex: adjustedIndex,
            };
          }
        }

        return {
          startIndex: newStart,
          endIndex: newEnd,
          scale: zoomIn ? prev.scale * 2 : Math.max(1, prev.scale / 2),
          centerIndex: adjustedIndex,
        };
      });
    },
    [data.length]
  );

  const handleZoomIn = useCallback(
    (index?: number) => {
      if (typeof index === "number") {
        handlePointZoom(index, true);
      } else {
        setZoomState((prev) => {
          const range = prev.endIndex - prev.startIndex;
          const middle = Math.floor((prev.startIndex + prev.endIndex) / 2);
          const newRange = Math.max(Math.floor(range / 2), 2);

          return {
            startIndex: Math.max(0, middle - Math.floor(newRange / 2)),
            endIndex: Math.min(
              data.length - 1,
              middle + Math.floor(newRange / 2)
            ),
            scale: prev.scale * 2,
            centerIndex: prev.centerIndex,
          };
        });
      }
    },
    [data.length, handlePointZoom]
  );

  const handleZoomOut = useCallback(
    (index?: number) => {
      if (typeof index === "number") {
        handlePointZoom(index, false);
      } else {
        setZoomState((prev) => {
          const range = prev.endIndex - prev.startIndex;
          const middle = Math.floor((prev.startIndex + prev.endIndex) / 2);
          const newRange = Math.min(range * 2, data.length - 1);

          return {
            startIndex: Math.max(0, middle - Math.floor(newRange / 2)),
            endIndex: Math.min(
              data.length - 1,
              middle + Math.floor(newRange / 2)
            ),
            scale: Math.max(1, prev.scale / 2),
            centerIndex: prev.centerIndex,
          };
        });
      }
    },
    [data.length, handlePointZoom]
  );

  const handlePan = useCallback(
    (direction: "left" | "right") => {
      setZoomState((prev) => {
        const range = prev.endIndex - prev.startIndex;
        const shift = Math.max(1, Math.floor(range * 0.25));

        if (direction === "left") {
          const newStart = Math.max(0, prev.startIndex - shift);
          return {
            startIndex: newStart,
            endIndex: newStart + range,
            scale: prev.scale,
            centerIndex: prev.centerIndex,
          };
        } else {
          const newEnd = Math.min(data.length - 1, prev.endIndex + shift);
          return {
            startIndex: newEnd - range,
            endIndex: newEnd,
            scale: prev.scale,
            centerIndex: prev.centerIndex,
          };
        }
      });
    },
    [data.length]
  );

  const resetZoom = useCallback(() => {
    setZoomState({
      startIndex: 0,
      endIndex: data.length - 1,
      scale: 1,
      centerIndex: null,
    });
  }, [data.length]);

  return {
    zoomedData,
    handleZoomIn,
    handleZoomOut,
    handlePan,
    resetZoom,
    isZoomed: zoomState.scale > 1,
  };
}
