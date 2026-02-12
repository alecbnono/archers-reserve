import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BsGlobeAsiaAustralia } from "react-icons/bs";
import { LuCalendarClock } from "react-icons/lu";

export default function ConfirmationDisplay() {
    return (
        <Card className="rounded-3xl border-2 border-green-300 bg-green-100">
            <CardContent className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <LuCalendarClock size={24} />
                    <div className="flex flex-col gap-1">
                        <p className="text-md font-medium">Monday, January 2, 3005</p>
                        <p>14:00 (2:00 PM)</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <BsGlobeAsiaAustralia size={24} />
                    <div className="flex flex-col gap-1">
                        <p className="text-md font-medium">Time Zone: Philippines/Manila</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
