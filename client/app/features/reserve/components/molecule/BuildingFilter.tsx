import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";

export default function BuildingFilter() {
    return (
        <div className="flex flex-col gap-2">
            <h2>Filter by Building</h2>
            <Field orientation="horizontal">
                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                <FieldLabel htmlFor="terms-checkbox-basic">
                    St. La Salle Hall
                </FieldLabel>
            </Field>
            <Field orientation="horizontal">
                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                <FieldLabel htmlFor="terms-checkbox-basic">
                    John Gokongwei Sr. Hall
                </FieldLabel>
            </Field>
            <Field orientation="horizontal">
                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                <FieldLabel htmlFor="terms-checkbox-basic">St. Joseph Hall</FieldLabel>
            </Field>
            <Field orientation="horizontal">
                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
                <FieldLabel htmlFor="terms-checkbox-basic">
                    Urbano J. Velasco Hall
                </FieldLabel>
            </Field>
        </div>
    );
}
