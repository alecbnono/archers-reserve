
import FilterLaboratory from "@/features/reserve/components/organism/FilterLaboratory";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import ReserveLogRow from "../molecule/ReserveLogRow";

export default function AdminReserveLogs() {
    return (
        <div className="flex flex-col gap-6 p-2 md:p-8 w-full">
            <h1 className="text-3xl font-bold ml-4">Admin Logs</h1>
            <div className="flex md:flex-row-reverse justify-end flex-col gap-4">
                <Card className="grow w-full">
                    <CardHeader>
                        <CardTitle>Active Reservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Table className="grow w-full">
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[100px]">Reserve ID</TableHead>
                            <TableHead >Date</TableHead>
                            <TableHead >Room</TableHead>
                            <TableHead >First Name</TableHead>
                            <TableHead >Start Time</TableHead>
                            <TableHead >Cancel</TableHead>
                            <TableHead >Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        <ReserveLogRow/>
                        <ReserveLogRow/>
                        <ReserveLogRow/>
                        <ReserveLogRow/>
                        <ReserveLogRow/>
                        <ReserveLogRow/>
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
                <FilterLaboratory />
            </div>
        </div>
    );
}
