import { FaBook, FaUsers } from "react-icons/fa";
import { LuScreenShare } from "react-icons/lu";
import { FaUserLarge } from "react-icons/fa6";
import { LuScroll } from "react-icons/lu";
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

import { NavLink } from "react-router";
import { useAuthStore } from "~/store/user.store";

export default function DashboardNav() {
    const currentUser = useAuthStore((state) => state.currentUser);

    return (
        <>
            <nav className="hidden md:flex flex-col gap-8 p-8 border-r-1 h-screen">
                <NavLink to="/" className="flex items-center gap-2">
                    <LuScreenShare size={24} />
                    <p className="font-medium">ArchersReserve</p>
                </NavLink>
                <p className="">
                    Welcome, <span className="font-bold">{currentUser?.firstName}</span>
                </p>
                <div className="flex flex-col gap-2">
                    <NavLink to="dashboard/profile" className="w-full">
                        {({ isActive }) => (
                            <Button
                                variant={isActive ? "default" : "outline"}
                                className="justify-start py-5 w-full gap-3"
                            >
                                <FaUserLarge />
                                Account
                            </Button>
                        )}
                    </NavLink>
                    <NavLink to="dashboard/lab" className="w-full">
                        {({ isActive }) => (
                            <Button
                                variant={isActive ? "default" : "outline"}
                                className="justify-start py-5 w-full gap-3"
                            >
                                <FaBook />
                                Reserve
                            </Button>
                        )}
                    </NavLink>
                    <NavLink to="dashboard/users" className="w-full">
                        {({ isActive }) => (
                            <Button
                                variant={isActive ? "default" : "outline"}
                                className="justify-start py-5 w-full gap-3"
                            >
                                <FaUsers />
                                Users
                            </Button>
                        )}
                    </NavLink>
                    {currentUser?.role === "ADMIN" ? (
                        <NavLink to="dashboard/logs" className="w-full">
                            {({ isActive }) => (
                                <Button
                                    variant={isActive ? "default" : "outline"}
                                    className="justify-start py-5 w-full gap-3"
                                >
                                    <LuScroll />
                                    Logs
                                </Button>
                            )}
                        </NavLink>
                    ) : (
                        <></>
                    )}
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
                            <NavLink to="dashboard/profile" className="w-full">
                                {({ isActive }) => (
                                    <Button
                                        variant={isActive ? "default" : "outline"}
                                        className="justify-start py-5 w-full gap-3"
                                    >
                                        <FaUserLarge />
                                        Account
                                    </Button>
                                )}
                            </NavLink>
                            <NavLink to="dashboard/lab" className="w-full">
                                {({ isActive }) => (
                                    <Button
                                        variant={isActive ? "default" : "outline"}
                                        className="justify-start py-5 w-full gap-3"
                                    >
                                        <FaBook />
                                        Reserve
                                    </Button>
                                )}
                            </NavLink>
                            <NavLink to="dashboard/users" className="w-full">
                                {({ isActive }) => (
                                    <Button
                                        variant={isActive ? "default" : "outline"}
                                        className="justify-start py-5 w-full gap-3"
                                    >
                                        <FaUsers />
                                        Users
                                    </Button>
                                )}
                            </NavLink>

                            {currentUser?.role === "ADMIN" ? (
                                <NavLink to="dashboard/logs" className="w-full">
                                    {({ isActive }) => (
                                        <Button
                                            variant={isActive ? "default" : "outline"}
                                            className="justify-start py-5 w-full gap-3"
                                        >
                                            <LuScroll />
                                            Logs
                                        </Button>
                                    )}
                                </NavLink>
                            ) : (
                                <></>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
