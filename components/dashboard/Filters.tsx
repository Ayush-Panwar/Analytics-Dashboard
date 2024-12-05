"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FilterState } from "@/lib/types/analytics";
import { useUrlParams } from "@/lib/hooks/useUrlParams";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { PreferencesReset } from "./PreferencesReset";
import {
  saveFilterPreferences,
  loadFilterPreferences,
} from "@/lib/utils/preferences";
import { DateRangePopover } from "./DateRangePopover";
import { toast } from "sonner";

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export function Filters({ onFilterChange }: FiltersProps) {
  const { getFiltersFromUrl, updateUrl, hasUrlParams } = useUrlParams();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      const urlFilters = getFiltersFromUrl();
      const savedFilters = loadFilterPreferences();

      let initialFilters: FilterState;

      if (hasUrlParams()) {
        initialFilters = urlFilters;
      } else {
        initialFilters = {
          dateRange: {
            from: savedFilters.dateRange?.from,
            to: savedFilters.dateRange?.to,
          },
          ageGroup: savedFilters.ageGroup || [],
          gender: savedFilters.gender || [],
        };
        updateUrl(initialFilters, true);
      }

      setDateRange({
        from: initialFilters.dateRange.from,
        to: initialFilters.dateRange.to,
      });
      setAgeGroups(initialFilters.ageGroup);
      setGenders(initialFilters.gender);
      onFilterChange(initialFilters);
      setInitialized(true);
    }
  }, [initialized, onFilterChange]);

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    const newFilters = updateFilters(range, ageGroups, genders);
    updateUrl(newFilters);
    saveFilterPreferences(newFilters);
  };

  const handleAgeGroupChange = (checked: boolean, value: string) => {
    const newAgeGroups = checked
      ? [...ageGroups, value]
      : ageGroups.filter((group) => group !== value);
    setAgeGroups(newAgeGroups);
    const newFilters = updateFilters(dateRange, newAgeGroups, genders);
    updateUrl(newFilters);
    saveFilterPreferences(newFilters);
  };

  const handleGenderChange = (checked: boolean, value: string) => {
    const newGenders = checked
      ? [...genders, value]
      : genders.filter((g) => g !== value);
    setGenders(newGenders);
    const newFilters = updateFilters(dateRange, ageGroups, newGenders);
    updateUrl(newFilters);
    saveFilterPreferences(newFilters);
  };

  const updateFilters = (
    dates: DateRange | undefined = dateRange,
    ages: string[] = ageGroups,
    selectedGenders: string[] = genders
  ): FilterState => {
    const filters = {
      dateRange: {
        from: dates?.from || undefined,
        to: dates?.to || undefined,
      },
      ageGroup: ages,
      gender: selectedGenders,
    };
    onFilterChange(filters);
    return filters;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleReset = () => {
    const emptyFilters: FilterState = {
      dateRange: {
        from: undefined,
        to: undefined,
      },
      ageGroup: [],
      gender: [],
    };

    setDateRange(undefined);
    setAgeGroups([]);
    setGenders([]);
    updateUrl(emptyFilters);
    onFilterChange(emptyFilters);
    toast.success("Filters have been reset!");
  };

  return (
    <Card className="w-full min-w-[280px]">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="shrink-0"
            title="Copy URL with current filters"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <PreferencesReset onReset={handleReset} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Date Range</Label>
          <DateRangePopover dateRange={dateRange} onSelect={handleDateChange} />
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-1 gap-4 xl:gap-6">
          <div className="space-y-2">
            <Label>Age Group</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="age-15-25"
                  checked={ageGroups.includes("15-25")}
                  onCheckedChange={(checked) =>
                    handleAgeGroupChange(checked as boolean, "15-25")
                  }
                />
                <label
                  htmlFor="age-15-25"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  15-25
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="age-25-plus"
                  checked={ageGroups.includes(">25")}
                  onCheckedChange={(checked) =>
                    handleAgeGroupChange(checked as boolean, ">25")
                  }
                />
                <label
                  htmlFor="age-25-plus"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  &gt;25
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gender-male"
                  checked={genders.includes("Male")}
                  onCheckedChange={(checked) =>
                    handleGenderChange(checked as boolean, "Male")
                  }
                />
                <label
                  htmlFor="gender-male"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Male
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gender-female"
                  checked={genders.includes("Female")}
                  onCheckedChange={(checked) =>
                    handleGenderChange(checked as boolean, "Female")
                  }
                />
                <label
                  htmlFor="gender-female"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Female
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
