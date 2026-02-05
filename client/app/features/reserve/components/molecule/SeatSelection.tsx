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

export default function SeatSelection() {
    return (
        <Card className="flex flex-col items-center w-full gap-2 rounded-3xl border-2 border-green-300 bg-green-100">
            <CardContent>
                <div className="flex gap-2 flex-wrap justify-center max-w-50">
                    {Array.from({ length: 22 }, (_, i) => i + 1).map(() => (
                        <SeatBox />
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <p className="text-neutral-600 text-sm">Seats</p>
            </CardFooter>
        </Card>
    );
}
