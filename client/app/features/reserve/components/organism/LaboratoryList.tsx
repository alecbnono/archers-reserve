import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Label } from "@/components/ui/label";
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
import LaboratoryCard from "../molecule/LaboratoryCard";
import FilterLaboratory from "./FilterLaboratory";

export default function LaboratoryList() {
    return (
        <div className="flex flex-col gap-6 p-2 md:p-8">
            <h1 className="text-3xl font-bold ml-4">Reserve</h1>
            <div>
                <Tabs defaultValue="account" className="flex flex-col gap-4 ">
                    <TabsList className="text-xs">
                        {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
                            <TabsTrigger
                                key={day}
                                className="text-xs md:text-sm"
                                value={`jan-${day}`}
                            >
                                Jan {day}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="flex md:flex-row-reverse justify-end flex-col gap-2">
                        <FilterLaboratory />

                        <TabsContent value="jan-1" className="flex gap-2 flex-wrap w-full">
                            <LaboratoryCard />
                            <LaboratoryCard />
                            <LaboratoryCard />
                            <LaboratoryCard />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
