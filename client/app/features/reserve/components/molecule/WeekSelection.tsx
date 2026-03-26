import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldLabel,
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

import { useAuthStore } from "~/store/user.store";
import type { WeekOption } from "~/features/reserve/utils/date";

type WeekSelectionProps = {
    weeks: WeekOption[];
    value: number;
    onChange: (weekNumber: number) => void;
    isRecurring: boolean;
    onRecurringChange: (value: boolean) => void;
};

export default function WeekSelection({ weeks, value, onChange, isRecurring, onRecurringChange }: WeekSelectionProps) {
    const currentUser = useAuthStore((state) => state.currentUser);

    return (
        <div className="flex gap-2 px-2">
            {currentUser?.role !== "STUDENT" ? (
                <Field orientation="horizontal">
                    <Checkbox
                        id="terms-checkbox-basic"
                        name="terms-checkbox-basic"
                        checked={isRecurring}
                        onCheckedChange={(value) => {
                            onRecurringChange(!!value);
                        }}
                    />
                    <FieldLabel htmlFor="terms-checkbox-basic">Recurring?</FieldLabel>
                </Field>
            ) : (
                <></>
            )}
            <Select
                disabled={isRecurring}
                value={value.toString()}
                onValueChange={(v) => onChange(Number(v))}
            >
                <SelectTrigger className="w-full max-w-64 text-xs">
                    <SelectValue placeholder="Week" className="text-xs" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                    <SelectGroup>
                        <SelectLabel className="text-xs">Week</SelectLabel>
                        {weeks.map((week) => (
                            <SelectItem
                                key={week.weekNumber}
                                value={week.weekNumber.toString()}
                                className="text-xs"
                                disabled={week.isPast}
                            >
                                {week.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
