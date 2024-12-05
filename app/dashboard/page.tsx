"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Filters } from "@/components/dashboard/Filters";
import { FeatureBarChart } from "@/components/dashboard/FeatureBarChart";
import { TimeSeriesChart } from "@/components/dashboard/TimeSeriesChart";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { useChartData } from "@/lib/hooks/useChartData";
import { FilterState } from "@/lib/types/analytics";

export default function DashboardPage() {
  const { data, loading, error, applyFilters } = useAnalytics();
  const { featureData, getTimeSeriesData } = useChartData(data);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const handleFilterChange = (filters: FilterState) => {
    applyFilters(filters);
    setSelectedFeature(null);
  };

  const handleFeatureClick = (feature: string) => {
    setSelectedFeature(feature);
  };

  const handleTimeSeriesClose = () => {
    setSelectedFeature(null);
  };

  if (error) {
    return <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>;
  }

  return (
    <div className="space-y-4 xl:space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 xl:gap-6">
        <div className="xl:col-span-1 w-full">
          <Filters onFilterChange={handleFilterChange} />
        </div>

        <div className="xl:col-span-3 space-y-4 xl:space-y-6">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <FeatureBarChart
                data={featureData}
                selectedFeature={selectedFeature}
                onFeatureClick={handleFeatureClick}
              />

              {selectedFeature && (
                <TimeSeriesChart
                  data={getTimeSeriesData(selectedFeature)}
                  feature={selectedFeature}
                  onClose={handleTimeSeriesClose}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
