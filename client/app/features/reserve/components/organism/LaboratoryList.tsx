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
        <div className="flex flex-col gap-6 p-8">
            <h1 className="text-3xl font-bold">Reserve</h1>
            <div>
                <Tabs defaultValue="account" className="flex flex-col gap-4">
                    <TabsList>
                        <TabsTrigger value="jan-1">Jan 1</TabsTrigger>
                        <TabsTrigger value="jan-2">Jan 2</TabsTrigger>
                        <TabsTrigger value="jan-3">Jan 3</TabsTrigger>
                        <TabsTrigger value="jan-4">Jan 4</TabsTrigger>
                        <TabsTrigger value="jan-5">Jan 5</TabsTrigger>
                        <TabsTrigger value="jan-6">Jan 6</TabsTrigger>
                        <TabsTrigger value="jan-7">Jan 7</TabsTrigger>
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
