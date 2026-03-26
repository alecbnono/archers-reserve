import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";

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
    const navigate = useNavigate();
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

    // Format end date for recurring reservations
    let dateDisplay = resDate;
    if (reservation.isRecurring && reservation.reservationDateEnd) {
        const endStr = reservation.reservationDateEnd.includes("T")
            ? reservation.reservationDateEnd.slice(0, 10)
            : reservation.reservationDateEnd;
        const [ey, em, ed] = endStr.split("-").map(Number);
        const endDate = new Date(ey, em - 1, ed).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        dateDisplay = `${resDate} – ${endDate}`;
    }

    // Actions are only meaningful on upcoming reservations
    // For recurring ongoing batches, cancel is allowed (cancels future occurrences only)
    const isUpcoming = reservation.status === "UPCOMING";
    const canEdit = canManage && isUpcoming;
    const canCancel = canManage && (isUpcoming || (reservation.status === "ONGOING" && reservation.isRecurring));

    const handleEdit = () => {
        if (!canEdit) return;
        const params = new URLSearchParams({
            roomId: String(reservation.roomId),
            date: dateStr,
            batchId: reservation.batchId,
        });
        navigate(`/dashboard/lab/confirm?${params.toString()}`);
    };

    return (
        <TableRow>
            <TableCell className="font-medium">
                {reservation.batchId.startsWith("legacy-")
                    ? reservation.batchId.replace("legacy-", "#")
                    : reservation.batchId.slice(0, 8)}
            </TableCell>
            <TableCell>{requestedStr}</TableCell>
            <TableCell>
                {dateDisplay}
                {reservation.isRecurring && (
                    <span className="ml-1 text-xs text-muted-foreground">(weekly)</span>
                )}
            </TableCell>
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
                            disabled={!canCancel || isCancelling}
                            onClick={() => onCancel(reservation.batchId)}
                        >
                            {isCancelling ? "Cancelling..." : (reservation.status === "ONGOING" && reservation.isRecurring ? "Cancel Future" : "Cancel")}
                        </Button>
                    </TableCell>
                    <TableCell>
                        <Button
                            variant="secondary"
                            disabled={!canEdit}
                            onClick={handleEdit}
                        >
                            Edit
                        </Button>
                    </TableCell>
                </>
            )}
        </TableRow>
    );
}
