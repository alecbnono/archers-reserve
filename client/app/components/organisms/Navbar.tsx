import { LuScreenShare } from "react-icons/lu";
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
import { IoMenu } from "react-icons/io5";
import { NavLink } from "react-router";

export default function Navbar() {
    return (
        <>
            <nav className="hidden md:flex py-5 px-10 justify-between">
                <div className="flex items-center gap-2">
                    <LuScreenShare size={24} />
                    <p className="font-medium">ArchersReserve</p>
                </div>
                <div className="flex gap-4">
                    <p>Login</p>
                    <p>Register</p>
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
                            <Button variant="outline">Login</Button>
                            <Button variant="outline">Register</Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
