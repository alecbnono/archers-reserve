import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import ReserveLogRow from "../molecule/ReserveLogRow";

import type { ReservationType } from "~/types/reservation.types";

export default function ReserveLogs({
    reservations,
    isLoading,
    error,
    canManage,
    isAdmin,
    onCancel,
    cancellingBatchId,
    cancelError,
}: {
    reservations: ReservationType[];
    isLoading: boolean;
    error: string;
    canManage: boolean;
    isAdmin: boolean;
    onCancel: (batchId: string) => Promise<boolean>;
    cancellingBatchId: string | null;
    cancelError: string;
}) {
    return (
        <Card className="grow w-full">
            <CardHeader>
                <CardTitle>Reservations</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <p className="text-muted-foreground text-center py-8">
                        Loading reservations...
                    </p>
                ) : error ? (
                    <p className="text-destructive text-center py-8">{error}</p>
                ) : reservations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        No reservations found.
                    </p>
                ) : (
                    <Table className="grow w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Batch</TableHead>
                                <TableHead>Request Time</TableHead>
                                <TableHead>Reservation Date</TableHead>
                                <TableHead>Time Slot</TableHead>
                                <TableHead>Building</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Seat</TableHead>
                                {isAdmin && (
                                    <>
                                        <TableHead>Reserved By</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                    </>
                                )}
                                <TableHead>Anonymized</TableHead>
                                <TableHead>Status</TableHead>
                                {canManage && (
                                    <>
                                        <TableHead>Cancel</TableHead>
                                        <TableHead>Edit</TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cancelError && (
                                <TableRow>
                                    <TableCell
                                        colSpan={isAdmin ? 14 : 11}
                                        className="text-destructive text-center"
                                    >
                                        {cancelError}
                                    </TableCell>
                                </TableRow>
                            )}
                            {reservations.map((reservation) => (
                                <ReserveLogRow
                                    key={reservation.batchId}
                                    reservation={reservation}
                                    canManage={canManage}
                                    isAdmin={isAdmin}
                                    onCancel={onCancel}
                                    isCancelling={
                                        cancellingBatchId === reservation.batchId
                                    }
                                />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
