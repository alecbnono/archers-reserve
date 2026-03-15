import { useMemo, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LaboratoryCard from "../molecule/LaboratoryCard";
import FilterLaboratory from "./FilterLaboratory";
import WeekSelection from "../molecule/WeekSelection";
import { useRooms } from "~/features/reserve/hooks/useRooms";
import {
    getWeeksForYear,
    getCurrentWeekNumber,
    getDaysForWeek,
    getFirstValidDayIndex,
} from "~/features/reserve/utils/date";

export default function LaboratoryList() {
    const { rooms, isLoading, error } = useRooms();

    const today = useMemo(() => new Date(), []);
    const year = today.getFullYear();

    // All weeks for the current year
    const allWeeks = useMemo(() => getWeeksForYear(year, today), [year, today]);

    // Current week number (for windowing)
    const currentWeekNumber = useMemo(
        () => getCurrentWeekNumber(allWeeks, today),
        [allWeeks, today]
    );

    // Show only ±5 weeks around the current week
    const weeks = useMemo(() => {
        const min = currentWeekNumber - 5;
        const max = currentWeekNumber + 5;
        return allWeeks.filter((w) => w.weekNumber >= min && w.weekNumber <= max);
    }, [allWeeks, currentWeekNumber]);

    // Selected week number (defaults to current week)
    const [selectedWeek, setSelectedWeek] = useState(() => currentWeekNumber);

    // Days for the selected week
    const weekData = useMemo(() => {
        const week = weeks.find((w) => w.weekNumber === selectedWeek);
        if (!week) return null;
        return {
            startDate: week.startDate,
            days: getDaysForWeek(week.startDate, today),
        };
    }, [weeks, selectedWeek, today]);

    // Active day index (0..6), auto-corrected to first valid day
    const [activeDayIndex, setActiveDayIndex] = useState(() => {
        if (!weekData) return 0;
        return getFirstValidDayIndex(weekData.days);
    });

    // When week changes, auto-correct active day
    const handleWeekChange = useCallback(
        (weekNumber: number) => {
            setSelectedWeek(weekNumber);
            const week = weeks.find((w) => w.weekNumber === weekNumber);
            if (week) {
                const days = getDaysForWeek(week.startDate, today);
                setActiveDayIndex(getFirstValidDayIndex(days));
            }
        },
        [weeks, today]
    );

    // When day tab changes, validate it's not past before applying
    const handleDayChange = useCallback(
        (value: string) => {
            const index = Number(value);
            if (weekData && !weekData.days[index]?.isPast) {
                setActiveDayIndex(index);
            }
        },
        [weekData]
    );

    // Selected date string for passing downstream
    const selectedDate = weekData?.days[activeDayIndex]?.dateString;

    const roomContent = isLoading ? (
        <p className="text-muted-foreground text-center py-8 w-full">
            Loading rooms...
        </p>
    ) : error ? (
        <p className="text-destructive text-center py-8 w-full">
            {error}
        </p>
    ) : rooms.length === 0 ? (
        <p className="text-muted-foreground text-center py-8 w-full">
            No rooms found.
        </p>
    ) : (
        rooms.map((room, index) => (
            <div
                key={room.roomId}
                className="animate-card-in grow"
                style={{ animationDelay: `${index * 60}ms` }}
            >
                <LaboratoryCard room={room} selectedDate={selectedDate} />
            </div>
        ))
    );

    // Key for re-triggering stagger animation on day/week change
    const animationKey = `${selectedWeek}-${activeDayIndex}`;

    return (
        <div className="flex flex-col gap-6 p-2 md:p-8">
            <h1 className="text-3xl font-bold ml-4">Reserve</h1>
            <div>
                <Tabs
                    value={activeDayIndex.toString()}
                    onValueChange={handleDayChange}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                        <TabsList className="text-xs">
                            {weekData?.days.map((day) => (
                                <TabsTrigger
                                    key={day.index}
                                    className="text-xs md:text-sm"
                                    value={day.index.toString()}
                                    disabled={day.isPast}
                                >
                                    {day.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <WeekSelection
                            weeks={weeks}
                            value={selectedWeek}
                            onChange={handleWeekChange}
                        />
                    </div>
                    <div className="flex md:flex-row-reverse justify-end flex-col gap-2">
                        <FilterLaboratory />

                        <TabsContent
                            key={animationKey}
                            value={activeDayIndex.toString()}
                            className="flex gap-2 flex-wrap w-full"
                            forceMount
                        >
                            {roomContent}
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
