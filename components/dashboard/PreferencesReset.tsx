"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { clearFilterPreferences } from "@/lib/utils/preferences";

interface PreferencesResetProps {
  onReset: () => void;
}

export function PreferencesReset({ onReset }: PreferencesResetProps) {
  const handleReset = () => {
    clearFilterPreferences();
    onReset();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReset}
      className="w-full"
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      Reset Filters
    </Button>
  );
}
