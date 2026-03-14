import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

import type { ReservationType } from "~/types/reservation.types";
import { formatDateTime } from "~/lib/utils";

const STATUS_STYLES: Record<string, string> = {
    UPCOMING: "text-blue-600 font-semibold",
    ONGOING: "text-green-600 font-semibold",
    COMPLETED: "text-muted-foreground",
    CANCELLED: "text-red-600 font-semibold",
};

export default function ReserveLogRow({
    reservation,
    canManage,
    isAdmin,
}: {
    reservation: ReservationType;
    canManage: boolean;
    isAdmin: boolean;
}) {
    const requested = formatDateTime(reservation.requestTime);
    const requestedStr = `${requested.datePart} ${requested.timePart}`;

    // Format reservation date (DATE string like "2026-03-02")
    const resDate = new Date(reservation.reservationDate).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" },
    );

    // Format timeslot as "HH:MM - HH:MM"
    const formatTime = (t: string) => t.slice(0, 5); // "08:00:00" -> "08:00"
    const timeSlot = `${formatTime(reservation.startTime)} - ${formatTime(reservation.endTime)}`;

    return (
        <TableRow>
            <TableCell className="font-medium">
                {reservation.reservationId}
            </TableCell>
            <TableCell>{requestedStr}</TableCell>
            <TableCell>{resDate}</TableCell>
            <TableCell>{timeSlot}</TableCell>
            <TableCell>{reservation.building}</TableCell>
            <TableCell>{reservation.roomCode}</TableCell>
            <TableCell>{reservation.seatId}</TableCell>

            {isAdmin && (
                <>
                    <TableCell>
                        {reservation.firstName} {reservation.lastName}
                    </TableCell>
                    <TableCell>{reservation.email}</TableCell>
                    <TableCell>{reservation.role}</TableCell>
                </>
            )}

            <TableCell>{reservation.isAnonymous ? "Yes" : "No"}</TableCell>
            <TableCell className={STATUS_STYLES[reservation.status] ?? ""}>
                {reservation.status}
            </TableCell>

            {canManage && (
                <>
                    <TableCell>
                        <Button variant="destructive">Cancel</Button>
                    </TableCell>
                    <TableCell>
                        <Link to="/dashboard/lab">
                            <Button variant="secondary">Edit</Button>
                        </Link>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
}
