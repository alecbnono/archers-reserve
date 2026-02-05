import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useState } from "react";

export default function WeekSelection() {
    const [checked, setChecked] = useState(false);

    return (
        <div className="flex gap-2 px-2">
            <Field orientation="horizontal">
                <Checkbox
                    id="terms-checkbox-basic"
                    name="terms-checkbox-basic"
                    checked={checked}
                    onCheckedChange={(value) => {
                        setChecked(!!value);
                    }}
                />
                <FieldLabel htmlFor="terms-checkbox-basic">Recurring?</FieldLabel>
            </Field>
            <Select disabled={checked}>
                <SelectTrigger className="w-full max-w-48 text-xs">
                    <SelectValue placeholder="Week" className="text-xs" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                    <SelectGroup>
                        <SelectLabel className="text-xs">Week</SelectLabel>

                        {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => (
                            <SelectItem value={week.toString()} className="text-xs">
                                Week {week}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
