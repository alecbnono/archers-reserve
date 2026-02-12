import { FaSliders } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
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
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import TimeSlider from "../molecule/TimeSlider";
import BuildingFilter from "../molecule/BuildingFilter";

export default function FilterLaboratory() {
    return (
        <>
            <Sheet>
                <SheetTrigger asChild className="md:hidden w-fit">
                    <Button variant="outline" className="">
                        <FaSliders size={32} />
                    </Button>
                </SheetTrigger>
                <SheetContent side="top">
                    <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="px-4">
                        <FieldGroup className="mx-auto w-56">
                            <div className="flex flex-col gap-2">
                                <h2>General</h2>
                                <Field orientation="horizontal">
                                    <Checkbox
                                        id="terms-checkbox-basic"
                                        name="terms-checkbox-basic"
                                    />
                                    <FieldLabel htmlFor="terms-checkbox-basic">
                                        Filter Vacant
                                    </FieldLabel>
                                </Field>
                            </div>

                            <TimeSlider />

                            <BuildingFilter />
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
                        <div className="flex flex-col gap-2">
                            <h2>General</h2>
                            <Field orientation="horizontal">
                                <Checkbox
                                    id="terms-checkbox-basic"
                                    name="terms-checkbox-basic"
                                />
                                <FieldLabel htmlFor="terms-checkbox-basic">
                                    Filter Vacant
                                </FieldLabel>
                            </Field>
                        </div>

                        <TimeSlider />

                        <BuildingFilter />
                    </FieldGroup>
                </CardContent>
            </Card>
        </>
    );
}
