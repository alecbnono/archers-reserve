import { FaSliders } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import TimeSlider from "../molecule/TimeSlider";
import BuildingFilter from "../molecule/BuildingFilter";

type FilterLaboratoryProps = {
    buildings: string[];
    selectedBuildings: string[];
    onToggleBuilding: (building: string) => void;
    vacantOnly: boolean;
    onToggleVacant: (checked: boolean) => void;
    timeRange: [number, number];
    onTimeRangeChange: (range: [number, number]) => void;
    showVacantFilter?: boolean;
};

export default function FilterLaboratory({
    buildings,
    selectedBuildings,
    onToggleBuilding,
    vacantOnly,
    onToggleVacant,
    timeRange,
    onTimeRangeChange,
    showVacantFilter = true,
}: FilterLaboratoryProps) {
    return (
        <>
            <Sheet>
                <SheetTrigger asChild className="md:hidden w-fit">
                    <Button variant="outline">
                        <FaSliders size={32} />
                    </Button>
                </SheetTrigger>
                <SheetContent side="top">
                    <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="px-4">
                        <FieldGroup className="mx-auto w-56">
                            {showVacantFilter && (
                                <div className="flex flex-col gap-2">
                                    <h2>General</h2>
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id="filter-vacant-mobile"
                                            checked={vacantOnly}
                                            onCheckedChange={(checked) => onToggleVacant(checked === true)}
                                        />
                                        <FieldLabel htmlFor="filter-vacant-mobile">
                                            Filter Vacant
                                        </FieldLabel>
                                    </Field>
                                </div>
                            )}

                            <TimeSlider
                                timeRange={timeRange}
                                onTimeRangeChange={onTimeRangeChange}
                            />

                            <BuildingFilter
                                buildings={buildings}
                                selectedBuildings={selectedBuildings}
                                onToggleBuilding={onToggleBuilding}
                            />
                        </FieldGroup>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Card className="hidden md:block h-full">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <FieldGroup className="mx-auto w-56">
                        {showVacantFilter && (
                            <div className="flex flex-col gap-2">
                                <h2>General</h2>
                                <Field orientation="horizontal">
                                    <Checkbox
                                        id="filter-vacant-desktop"
                                        checked={vacantOnly}
                                        onCheckedChange={(checked) => onToggleVacant(checked === true)}
                                    />
                                    <FieldLabel htmlFor="filter-vacant-desktop">
                                        Filter Vacant
                                    </FieldLabel>
                                </Field>
                            </div>
                        )}

                        <TimeSlider
                        timeRange={timeRange}
                        onTimeRangeChange={onTimeRangeChange}
                        />

                        <BuildingFilter
                            buildings={buildings}
                            selectedBuildings={selectedBuildings}
                            onToggleBuilding={onToggleBuilding}
                        />
                    </FieldGroup>
                </CardContent>
            </Card>
        </>
    );
}