"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartData } from "@/lib/types/analytics";

interface FeatureBarChartProps {
  data: ChartData[];
  selectedFeature: string | null;
  onFeatureClick: (feature: string) => void;
}

export function FeatureBarChart({
  data,
  selectedFeature,
  onFeatureClick,
}: FeatureBarChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Feature Usage (Total Time Spent)</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Bar
              dataKey="value"
              onClick={(data) => onFeatureClick(data.name)}
              cursor="pointer"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill="hsl(var(--primary))"
                  opacity={
                    selectedFeature
                      ? entry.name === selectedFeature
                        ? 1
                        : 0.4
                      : 1
                  }
                  className="transition-opacity duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
