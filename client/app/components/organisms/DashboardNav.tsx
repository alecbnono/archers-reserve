import { FaBook } from "react-icons/fa";
import { LuScreenShare } from "react-icons/lu";
import { FaUserLarge } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { Button } from "../ui/button";
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

export default function DashboardNav() {
    return (
        <>
            <nav className="hidden md:flex flex-col gap-8 p-8 border-r-1 h-screen">
                <div className="flex items-center gap-2">
                    <LuScreenShare size={24} />
                    <p className="font-medium">ArchersReserve</p>
                </div>
                <div className="flex flex-col gap-2">
                    <Button className="justify-start py-5" variant="outline">
                        <FaUserLarge />
                        <p>Account</p>
                    </Button>
                    <Button className="justify-start py-5" variant="outline">
                        <FaBook />
                        <p>Reserve</p>
                    </Button>
                </div>
            </nav>
            <div className="flex justify-between md:hidden px-4 py-4">
                <div className="flex items-center gap-2">
                    <LuScreenShare size={24} />
                    <p className="font-medium">ArchersReserve</p>
                </div>

                <Sheet>
                    <SheetTrigger>
                        <Button className="p-0" variant="outline">
                            <IoMenu size={48} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="flex flex-col p-10 pt-15">
                        <div className="flex flex-col gap-4">
                            <Button className="justify-start py-5" variant="outline">
                                <FaUserLarge />
                                <p>Account</p>
                            </Button>
                            <Button className="justify-start py-5" variant="outline">
                                <FaBook />
                                <p>Reserve</p>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
