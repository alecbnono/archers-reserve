import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

import type { ReservationType } from "~/types/reservation.types";
import { formatDateTime, STATUS_STYLES } from "~/lib/utils";

export default function ReserveLogRow({
    reservation,
    canManage,
    isAdmin,
    onCancel,
    isCancelling,
}: {
    reservation: ReservationType;
    canManage: boolean;
    isAdmin: boolean;
    onCancel: (batchId: string) => Promise<boolean>;
    isCancelling: boolean;
}) {
    const requested = formatDateTime(reservation.requestTime);
    const requestedStr = `${requested.datePart} ${requested.timePart}`;

    // Format reservation date — normalize to YYYY-MM-DD first,
    // handling both plain date strings and ISO datetimes from the API.
    const dateStr = reservation.reservationDate.includes("T")
        ? reservation.reservationDate.slice(0, 10)
        : reservation.reservationDate;
    const [y, m, d] = dateStr.split("-").map(Number);
    const resDate = new Date(y, m - 1, d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    // Actions are only meaningful on upcoming reservations
    const isManageable = canManage && reservation.status === "UPCOMING";

    return (
        <TableRow>
            <TableCell className="font-medium">
                {reservation.batchId.startsWith("legacy-")
                    ? reservation.batchId.replace("legacy-", "#")
                    : reservation.batchId.slice(0, 8)}
            </TableCell>
            <TableCell>{requestedStr}</TableCell>
            <TableCell>{resDate}</TableCell>
            <TableCell>{reservation.timeSlot}</TableCell>
            <TableCell>{reservation.building}</TableCell>
            <TableCell>{reservation.roomCode}</TableCell>
            <TableCell>{reservation.seatLabel}</TableCell>

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
                        <Button
                            variant="destructive"
                            disabled={!isManageable || isCancelling}
                            onClick={() => onCancel(reservation.batchId)}
                        >
                            {isCancelling ? "Cancelling..." : "Cancel"}
                        </Button>
                    </TableCell>
                    <TableCell>
                        <Link to="/dashboard/lab">
                            <Button variant="secondary" disabled={!isManageable}>
                                Edit
                            </Button>
                        </Link>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
}
