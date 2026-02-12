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

export default function ReserveLogs() {
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
                            <TableHead>Date</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>First Name</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>Cancel</TableHead>
                            <TableHead>Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 22 }, (_, i) => i + 1).map((id) => (
                            <ReserveLogRow id={id} />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
