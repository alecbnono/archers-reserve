import { TableCell, TableRow } from "@/components/ui/table";

import { Button } from "~/components/ui/button";
import type { ReservationType } from "~/types/reservation.types";

import { formatDateTime } from "~/lib/utils";

import { Link } from "react-router";

export default function ReserveLogRow({
    reservation,
    canManage,
    isAdmin,
}: {
    reservation: ReservationType;
    canManage: boolean;
    isAdmin: boolean;
}) {
    const requested = `${formatDateTime(reservation.requestTime).datePart} ${formatDateTime(reservation.requestTime).timePart}`;
    const start = `${formatDateTime(reservation.startTime).datePart} ${formatDateTime(reservation.startTime).timePart}`;

    return (
        <TableRow>
            <TableCell className="font-medium">{reservation.id}</TableCell>
            <TableCell>{requested}</TableCell>
            <TableCell>{start}</TableCell>
            <TableCell>{reservation.building}</TableCell>
            <TableCell>{reservation.room}</TableCell>
            <TableCell>
                {reservation.seatRow + reservation.seatCol.toString()}
            </TableCell>

            {isAdmin === true ? (
                <>
                    <TableCell>{reservation.firstName}</TableCell>
                    <TableCell>{reservation.lastName}</TableCell>
                </>
            ) : (
                <></>
            )}

            {canManage === true ? (
                <>
                    <TableCell>
                        <Button variant="destructive">Delete</Button>
                    </TableCell>
                    <TableCell>
                        <Link to="/dashboard/lab">
                            <Button variant="secondary">Edit</Button>
                        </Link>
                    </TableCell>
                </>
            ) : (
                <></>
            )}
        </TableRow>
    );
}
