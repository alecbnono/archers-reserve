import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import ReserveLogRow from "../molecule/ReserveLogRow";

import { MOCK_RESERVATIONS } from "~/data/mockReservations";

export default function ReserveLogs({
    canManage,
    isAdmin,
}: {
    canManage: boolean;
    isAdmin: boolean;
}) {
    return (
        <Card className="grow w-full">
            <CardHeader>
                <CardTitle>Reservations</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="grow w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Reserve ID</TableHead>
                            <TableHead>Request Time</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>Building</TableHead>
                            <TableHead>Room</TableHead>

                            <TableHead>Seat Number</TableHead>
                            {isAdmin === true ? (
                                <>
                                    <TableHead>First Name</TableHead>
                                    <TableHead>Last Name</TableHead>
                                </>
                            ) : (
                                <></>
                            )}

                            {canManage === true ? (
                                <>
                                    <TableHead>Cancel</TableHead>
                                    <TableHead>Edit</TableHead>
                                </>
                            ) : (
                                <></>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_RESERVATIONS.map((reservation) => (
                            <ReserveLogRow
                                key={reservation.id}
                                reservation={reservation}
                                canManage={canManage}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
