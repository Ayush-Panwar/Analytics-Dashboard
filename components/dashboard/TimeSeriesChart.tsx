"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TimeSeriesData } from "@/lib/types/analytics";
import { useTimeSeriesChart } from "@/lib/hooks/useTimeSeriesChart";
import { useState } from "react";
import { ChartControls } from "./ChartControls";

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  feature: string;
  onClose: () => void;
}

export function TimeSeriesChart({
  data: initialData,
  feature,
  onClose,
}: TimeSeriesChartProps) {
  const {
    data,
    isZoomed,
    handleZoom,
    handleZoomIn,
    handleZoomOut,
    handlePan,
    resetZoom,
  } = useTimeSeriesChart(initialData);

  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);

  const handleMouseDown = (e: any) => {
    if (e) setRefAreaLeft(e.activeLabel);
  };

  const handleMouseMove = (e: any) => {
    if (e && refAreaLeft) setRefAreaRight(e.activeLabel);
  };

  const handleMouseUp = () => {
    if (!refAreaLeft || !refAreaRight) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    let leftIndex = initialData.findIndex((d) => d.date === refAreaLeft);
    let rightIndex = initialData.findIndex((d) => d.date === refAreaRight);

    if (leftIndex > rightIndex) {
      [leftIndex, rightIndex] = [rightIndex, leftIndex];
    }

    handleZoom({ start: leftIndex, end: rightIndex });
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  return (
    <Card className="w-full ">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <CardTitle>Time Trend: Feature {feature}</CardTitle>
          <ChartControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onPanLeft={() => handlePan("left")}
            onPanRight={() => handlePan("right")}
            onReset={resetZoom}
            isZoomed={isZoomed}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="h-[400px] select-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              allowDataOverflow={true}
              interval="preserveStartEnd"
            />
            <YAxis allowDataOverflow={true} domain={["auto", "auto"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            {refAreaLeft && refAreaRight && (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
