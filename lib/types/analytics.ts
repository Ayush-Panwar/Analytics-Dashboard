export interface AnalyticsData {
  id: string;
  feature: string;
  timeSpent: number;
  date: Date;
  age: string;
  gender: string;
}

export interface FilterState {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  ageGroup: string[];
  gender: string[];
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}