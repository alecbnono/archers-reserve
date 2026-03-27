import { LuScreenShare } from "react-icons/lu";
import { Button } from "../ui/button";
import { useState } from "react";
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
import { Link, NavLink } from "react-router";
import Registration from "~/features/auth/components/organisms/Registration";
import Login from "~/features/auth/components/organisms/Login";

import { useAuthStore } from "~/store/user.store";

export default function Navbar() {
    const currentUser = useAuthStore((state) => state.currentUser);

    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    const [sheetOpen, setSheetOpen] = useState(false);
    const openRegister = () => {
        setSheetOpen(false);
        setLogin(false);
        setRegister(true);
    };

    const openLogin = () => {
        setSheetOpen(false);
        setLogin(true);
        setRegister(false);
    };

    return (
        <>
            <nav className="hidden md:flex py-5 px-10 justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <LuScreenShare size={24} />
                    <p className="font-medium">ArchersReserve</p>
                </Link>
                {currentUser === null ? (
                    <div className="flex gap-4">
                        <Link to="/about">
                            <Button variant="outline">
                                About
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={openLogin}>
                            Login
                        </Button>
                        <Button variant="outline" onClick={openRegister}>
                            Register
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                    <Link to="/about">
                            <Button variant="outline">
                                About
                            </Button>
                        </Link>
                    <Link to="/dashboard/profile">
                        <Button variant="outline">
                            Dashboard
                        </Button>
                    </Link>
                    </div>

                )}
            </nav>
            <div className="flex justify-between md:hidden px-4 py-4">
                <Link to="/" className="flex items-center gap-2">
                    <LuScreenShare size={24} />
                    <p className="font-medium">ArchersReserve</p>
                </Link>

                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="p-0" variant="outline">
                            <IoMenu size={48} />
                        </Button>
                    </SheetTrigger>
                        <SheetContent className="flex flex-col p-10 pt-15">
                            <div className="flex flex-col gap-4">
                                <Link to="/about" onClick={() => setSheetOpen(false)}>
                                    <Button variant="outline" className="w-full">
                                        About
                                    </Button>
                                </Link>
                                <Button variant="outline" onClick={openLogin}>
                                    Login
                                </Button>
                                <Button variant="outline" onClick={openRegister}>
                                    Register
                                </Button>
                            </div>
                        </SheetContent>
                </Sheet>
            </div>

            {login === false ? (
                <></>
            ) : (
                <Login setLogin={setLogin} openRegister={openRegister} />
            )}

            {register === false ? (
                <></>
            ) : (
                <Registration setRegister={setRegister} openLogin={openLogin} />
            )}
        </>
    );
}
