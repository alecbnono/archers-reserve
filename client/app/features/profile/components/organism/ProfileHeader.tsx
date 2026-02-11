import { Button } from "~/components/ui/button";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProfileHeader() {
    return (
        <div className="p-6 flex gap-8 items-center">
            <img
                src="/hero.jpg"
                alt=""
                className="rounded-full aspect-square object-cover size-48"
            />
            <div className="flex gap-8">
                <div className="flex flex-col gap-1 ">
                    <h1 className="text-3xl font-bold">Alec Nono</h1>
                    <p className="">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
                        rerum incidunt ab quis. Earum necessitatibus a dicta deserunt,
                        voluptatem odio alias illo, consequatur eos, eius ad fuga et ex
                        minus.
                    </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Button className="bg-neutral-500 w-full">Edit</Button>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                className="hover:text-white text-black"
                                variant="destructive"
                            >
                                Delete
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>WARNING: This will delete your account!</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
