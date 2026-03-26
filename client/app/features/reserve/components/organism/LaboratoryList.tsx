import { useMemo, useState, useCallback, useEffect } from "react";
import type { RoomType } from "@/types/labs.types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LaboratoryCard from "../molecule/LaboratoryCard";
import FilterLaboratory from "./FilterLaboratory";
import WeekSelection from "../molecule/WeekSelection";
import { minutesToTimeString } from "../../utils/reserve";
import {
    getWeeksForYear,
    getCurrentWeekNumber,
    getDaysForWeek,
    getFirstValidDayIndex,
} from "~/features/reserve/utils/date";

export default function LaboratoryList() {
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [buildings, setBuildings] = useState<string[]>([]);
    const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
    const [vacantOnly, setVacantOnly] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<[number, number]>([420, 1080]); // 7:00–18:00
    const [isRecurring, setIsRecurring] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/rooms/buildings`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setBuildings(data.buildings || []))
            .catch(() => setError("Could not load buildings"));
    }, []);

    const toggleBuilding = (b: string) =>
        setSelectedBuildings((prev) =>
            prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b],
        );

    const today = useMemo(() => new Date(), []);
    const year = today.getFullYear();

    const allWeeks = useMemo(() => getWeeksForYear(year, today), [year, today]);

    const currentWeekNumber = useMemo(
        () => getCurrentWeekNumber(allWeeks, today),
        [allWeeks, today]
    );

    const weeks = useMemo(() => {
        const min = currentWeekNumber - 5;
        const max = currentWeekNumber + 5;
        return allWeeks.filter((w) => w.weekNumber >= min && w.weekNumber <= max);
    }, [allWeeks, currentWeekNumber]);

    const [selectedWeek, setSelectedWeek] = useState(() => currentWeekNumber);

    const weekData = useMemo(() => {
        const week = weeks.find((w) => w.weekNumber === selectedWeek);
        if (!week) return null;
        return {
            startDate: week.startDate,
            days: getDaysForWeek(week.startDate, today),
        };
    }, [weeks, selectedWeek, today]);

    const [activeDayIndex, setActiveDayIndex] = useState(() => {
        if (!weekData) return 0;
        return getFirstValidDayIndex(weekData.days);
    });

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

    const handleDayChange = useCallback(
        (value: string) => {
            const index = Number(value);
            if (isRecurring) {
                // Recurring mode: all weekdays are selectable
                if (index >= 0 && index <= 6) setActiveDayIndex(index);
            } else {
                if (weekData && !weekData.days[index]?.isPast) {
                    setActiveDayIndex(index);
                }
            }
        },
        [weekData, isRecurring]
    );

    // In recurring mode, date is irrelevant — only weekday matters
    const selectedDate = isRecurring ? undefined : weekData?.days[activeDayIndex]?.dateString;

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
                <LaboratoryCard room={room} selectedDate={selectedDate} isRecurring={isRecurring} selectedWeekday={isRecurring ? activeDayIndex : undefined} />
            </div>
        ))
    );

    /* Refetch rooms when filter or data changes
    *  Put in last as needed variables are defined in earlier functions.  
    */
    useEffect(() => {
        const params = new URLSearchParams();

        selectedBuildings.forEach((b) => {
            params.append("building", b);
        });

        if (vacantOnly) {
            params.set("vacant", "true");
            params.set("start_time", minutesToTimeString(timeRange[0]));
            params.set("end_time", minutesToTimeString(timeRange[1]));
            if (selectedDate) params.set("date", selectedDate);
        }

        const qs = params.toString();
        const url = `${API_URL}/rooms${qs ? `?${qs}` : ""}`;

        setIsLoading(true);
        setError(null);

        fetch(url, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setRooms(data.rooms || []);
                setIsLoading(false);
            })
            .catch(() => {
                setError("Could not load rooms");
                setIsLoading(false);
            });
    }, [selectedBuildings, vacantOnly, timeRange, selectedDate]);

    const animationKey = `${selectedWeek}-${activeDayIndex}`;

    return (
        <div className="flex flex-col gap-6 p-2 md:p-8 w-full">
            <h1 className="text-3xl font-bold ml-4">Reserve</h1>
            <div>
                <Tabs
                    value={activeDayIndex.toString()}
                    onValueChange={handleDayChange}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                        <TabsList className="text-xs h-auto p-1">
                            {weekData?.days.map((day) => {
                                const parts = day.label.split(" ");
                                const dayName = parts[0];
                                const dateLabel = parts.slice(1).join(" ");
                                return (
                                    <TabsTrigger
                                        key={day.index}
                                        value={day.index.toString()}
                                        disabled={isRecurring ? false : day.isPast}
                                        className="h-auto py-1 min-w-12 flex-col items-center leading-tight md:flex-row md:min-w-0 md:whitespace-nowrap"
                                    >
                                        <span className="whitespace-nowrap">{dayName}</span>
                                        {!isRecurring && (
                                            <span className="whitespace-nowrap text-[10px] md:text-xs">
                                                {dateLabel}
                                            </span>
                                        )}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                        <WeekSelection
                            weeks={weeks}
                            value={selectedWeek}
                            onChange={handleWeekChange}
                            isRecurring={isRecurring}
                            onRecurringChange={setIsRecurring}
                        />
                    </div>
                    <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_auto] md:items-start justify-end gap-2">
                        <TabsContent
                            key={animationKey}
                            value={activeDayIndex.toString()}
                            className="flex md:grid md:grid-cols-2 gap-2 flex-wrap w-full md:grid-cols-2"
                            forceMount
                        >
                            {roomContent}
                        </TabsContent>
                        <FilterLaboratory
                            buildings={buildings}
                            selectedBuildings={selectedBuildings}
                            onToggleBuilding={toggleBuilding}
                            vacantOnly={vacantOnly}
                            onToggleVacant={setVacantOnly}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                        />
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
