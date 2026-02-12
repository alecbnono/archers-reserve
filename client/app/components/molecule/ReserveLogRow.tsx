import { TableCell, TableRow } from "@/components/ui/table";

import { Button } from "~/components/ui/button";
import type { RowType } from "~/types/logs.types";

export default function ReserveLogRow({ id }: RowType) {
    return (
        <TableRow>
            <TableCell className="font-medium">{id}</TableCell>
            <TableCell>January 1</TableCell>
            <TableCell>G301</TableCell>
            <TableCell>Alec Marx Gabriel</TableCell>
            <TableCell>Nono</TableCell>
            <TableCell>11:30 AM</TableCell>
            <TableCell>
                <Button variant="destructive">Delete</Button>
            </TableCell>
            <TableCell>
                <Button variant="secondary">Edit</Button>
            </TableCell>
        </TableRow>
    );
}
