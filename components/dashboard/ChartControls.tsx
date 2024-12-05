"use client";

import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface ChartControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPanLeft: () => void;
  onPanRight: () => void;
  onReset: () => void;
  isZoomed: boolean;
}

export function ChartControls({
  onZoomIn,
  onZoomOut,
  onPanLeft,
  onPanRight,
  onReset,
  isZoomed,
}: ChartControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="h-8 w-8"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="h-8 w-8"
        disabled={!isZoomed}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPanLeft()}
        className="h-8 w-8"
        disabled={!isZoomed}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPanRight()}
        className="h-8 w-8"
        disabled={!isZoomed}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="h-8 w-8"
        disabled={!isZoomed}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
