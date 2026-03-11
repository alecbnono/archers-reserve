import SeatBox from "../atom/SeatBox";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "~/store/user.store";

interface SeatSelectionProps {
    totalSeats: number;
    selectedSeat: number | null;
    reserveAll: boolean;
    isAnonymous: boolean;
    onSeatSelect: (seat: number | null) => void;
    onReserveAllChange: (value: boolean) => void;
    onAnonymousChange: (value: boolean) => void;
}

export default function SeatSelection({
    totalSeats,
    selectedSeat,
    reserveAll,
    isAnonymous,
    onSeatSelect,
    onReserveAllChange,
    onAnonymousChange,
}: SeatSelectionProps) {
    const currentUser = useAuthStore((state) => state.currentUser);

    function handleSeatSelect(seatNumber: number) {
        if (reserveAll) return;
        // Toggle: deselect if already selected, otherwise select the new one
        onSeatSelect(selectedSeat === seatNumber ? null : seatNumber);
    }

    function handleReserveAllChange() {
        const next = !reserveAll;
        onReserveAllChange(next);
        if (next) {
            // Clear individual seat when reserving all
            onSeatSelect(null);
        }
    }

    return (
        <Card className="flex flex-col items-center w-full gap-4 rounded-3xl border-2 border-green-300 bg-green-100">
            <CardContent>
                <div className="flex gap-2 flex-wrap justify-center max-w-50">
                    {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => (
                        <SeatBox
                            key={seat}
                            seatNumber={seat}
                            checked={reserveAll || selectedSeat === seat}
                            disabled={reserveAll}
                            onSelect={handleSeatSelect}
                        />
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <p className="text-neutral-600 text-sm">Seats</p>
                <div className="flex gap-4">
                    {currentUser?.role !== "STUDENT" ? (
                        <div className="flex gap-2 items-center">
                            <p className="text-sm">Reserve all?</p>
                            <Checkbox
                                className="size-6 bg-white"
                                checked={reserveAll}
                                onCheckedChange={handleReserveAllChange}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="flex gap-2 items-center">
                        <p className="text-sm">Anonymous?</p>
                        <Checkbox
                            className="size-6 bg-white"
                            checked={isAnonymous}
                            onCheckedChange={() => onAnonymousChange(!isAnonymous)}
                        />
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
