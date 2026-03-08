import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LaboratoryCard from "../molecule/LaboratoryCard";
import FilterLaboratory from "./FilterLaboratory";
import WeekSelection from "../molecule/WeekSelection";
import { MOCK_LABS } from "~/data/mockLabs";

export default function LaboratoryList() {
    return (
        <div className="flex flex-col gap-6 p-2 md:p-8">
            <h1 className="text-3xl font-bold ml-4">Reserve</h1>
            <div>
                <Tabs defaultValue="jan-1" className="flex flex-col gap-4 ">
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between">
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
                        <WeekSelection />
                    </div>
                    <div className="flex md:flex-row-reverse justify-end flex-col gap-2">
                        <FilterLaboratory />

                        {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
                            <TabsContent
                                key={day}
                                value={"jan-" + day.toString()}
                                className="flex gap-2 flex-wrap w-full"
                            >
                                {MOCK_LABS.map((lab) => (
                                    <LaboratoryCard key={lab.id} lab={lab} />
                                ))}
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
