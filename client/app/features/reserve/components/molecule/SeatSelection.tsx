import SeatBox from "../atom/SeatBox";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "~/store/user.store";
import { useState } from "react";

export default function SeatSelection() {
    const [reserveAll, setReserveAll] = useState(false);

    const currentUser = useAuthStore((state) => state.currentUser);

    return (
        <Card className="flex flex-col items-center w-full gap-4 rounded-3xl border-2 border-green-300 bg-green-100">
            <CardContent>
                <div className="flex gap-2 flex-wrap justify-center max-w-50">
                    {Array.from({ length: 22 }, (_, i) => i + 1).map((seat) => (
                        <SeatBox key={seat} isDisabled={reserveAll} />
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
                                onCheckedChange={() => setReserveAll((prev) => !prev)}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="flex gap-2 items-center">
                        <p className="text-sm">Anonymous?</p>
                        <Checkbox className="size-6 bg-white" />
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
