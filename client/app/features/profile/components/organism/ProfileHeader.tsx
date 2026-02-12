import { Button } from "~/components/ui/button";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useAuthStore } from "~/store/user.store";

export default function ProfileHeader() {
    const currentUser = useAuthStore((state) => state.currentUser);

    return (
        <Card>
            <CardContent>
                <div className="p-6 flex flex-col md:flex-row gap-8 items-center">
                    <img
                        src="/profile.png"
                        alt=""
                        className="rounded-full aspect-square object-cover size-48"
                    />
                    <div className="flex gap-8 items-center">
                        <div className="flex flex-col gap-2 ">
                            <h1 className="text-3xl font-bold">{`${currentUser?.firstName} ${currentUser?.lastName}`}</h1>
                            <p className="">{currentUser?.bio}</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 md:mx-10">
                            <Button variant="outline" className="w-full">
                                Edit
                            </Button>
                            <Button className="bg-neutral-500 w-full">Log out</Button>
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
            </CardContent>
        </Card>
    );
}
