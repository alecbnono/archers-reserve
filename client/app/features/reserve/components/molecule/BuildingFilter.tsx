import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";

type BuildingFilterProps = {
  buildings: string[];
  selectedBuildings: string[];
  onToggleBuilding: (building: string) => void;
};

export default function BuildingFilter({
  buildings,
  selectedBuildings,
  onToggleBuilding,
}: BuildingFilterProps) {
    return (
    <div className="flex flex-col gap-2">
        <h2>Filter by Building</h2>

        {buildings.map((building) => {
        const id = `building-${building.replace(/\s+/g, "-").toLowerCase()}`;
        const checked = selectedBuildings.includes(building);

        return (
            <Field key={building} orientation="horizontal">
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={() => onToggleBuilding(building)}
            />
            <FieldLabel htmlFor={id}>{building}</FieldLabel>
            </Field>
        );
        })}

        {buildings.length === 0 && (
        <div className="text-sm text-slate-500">No buildings available</div>
        )}
    </div>
    );
}
