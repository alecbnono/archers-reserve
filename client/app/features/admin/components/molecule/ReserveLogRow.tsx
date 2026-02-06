import {
  TableCell,
  TableRow,
} from "@/components/ui/table"

import { ButtonEdit } from "../atom/ButtonEdit";
import { ButtonCancel } from "../atom/ButtonCancel";

export default function ReserveLogRow() {
    return (
        <TableRow>  
        <TableCell className="font-medium">12345</TableCell>
        <TableCell>January 1</TableCell>
        <TableCell>G301</TableCell>
        <TableCell>Mang Juan</TableCell>
        <TableCell>11:30 AM</TableCell>
        <TableCell><ButtonCancel/></TableCell>
        <TableCell><ButtonEdit/></TableCell>
        </TableRow>
    );
}