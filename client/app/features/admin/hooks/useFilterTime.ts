import { useState } from "react";
import type { TimeSliderValue } from "../types/filter.types";


const MIN_TIME = 420; // 7:00 AM
const MAX_TIME = 1080; // 6:00 PM
const DEFAULT_TIME_RANGE: TimeSliderValue = [420, 1080];

export function useFilterTime() {
  const [timeRange, setTimeRange] = useState<TimeSliderValue>(DEFAULT_TIME_RANGE);

  const updateTimeRange = (newRange: TimeSliderValue) => {
    setTimeRange(newRange);
  };

  const resetTimeRange = () => {
    setTimeRange(DEFAULT_TIME_RANGE);
  };

  return {
    timeRange,
    setTimeRange,
    updateTimeRange,
    resetTimeRange,
    minTime: MIN_TIME,
    maxTime: MAX_TIME,
  };
}
