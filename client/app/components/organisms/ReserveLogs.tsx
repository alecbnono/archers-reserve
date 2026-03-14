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
}: {
    reservations: ReservationType[];
    isLoading: boolean;
    error: string;
    canManage: boolean;
    isAdmin: boolean;
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
                                <TableHead className="w-[100px]">Reserve ID</TableHead>
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
                            {reservations.map((reservation) => (
                                <ReserveLogRow
                                    key={reservation.reservationId}
                                    reservation={reservation}
                                    canManage={canManage}
                                    isAdmin={isAdmin}
                                />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
