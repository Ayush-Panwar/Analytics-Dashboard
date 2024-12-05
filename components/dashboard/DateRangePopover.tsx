"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePopoverProps {
  dateRange: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
}

export function DateRangePopover({
  dateRange,
  onSelect,
}: DateRangePopoverProps) {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onSelect}
            numberOfMonths={2}
            className="[&_.rdp-month]:w-[200px] [&_.rdp-table]:w-full [&_.rdp-cell]:p-0 [&_.rdp-button]:w-full [&_.rdp-button]:p-2 [&_.rdp-nav]:flex [&_.rdp-nav]:justify-between [&_.rdp-nav]:w-full"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
