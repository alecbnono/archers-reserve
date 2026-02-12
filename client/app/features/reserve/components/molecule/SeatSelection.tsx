import SeatBox from "../atom/SeatBox";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "~/store/user.store";

export default function SeatSelection() {
    const currentUser = useAuthStore((state) => state.currentUser);

    return (
        <Card className="flex flex-col items-center w-full gap-4 rounded-3xl border-2 border-green-300 bg-green-100">
            <CardContent>
                <div className="flex gap-2 flex-wrap justify-center max-w-50">
                    {Array.from({ length: 22 }, (_, i) => i + 1).map(() => (
                        <SeatBox />
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <p className="text-neutral-600 text-sm">Seats</p>
                {currentUser?.role !== "STUDENT" ? (
                    <div className="flex gap-2 justify-center">
                        <p className="text-sm">Reserve all?</p>
                        <Checkbox className="size-6 bg-white" />
                    </div>
                ) : (
                    <></>
                )}
            </CardFooter>
        </Card>
    );
}
